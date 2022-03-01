const fs = require('fs');
const path = require('path');
const execa = require('execa');
const { getWatchAndDeployPath, judgeGroup } = require('./utils')

const isGroup = judgeGroup()

const watchAndDeployPath = getWatchAndDeployPath(isGroup)


function getStatInfo(info) {
  const { birthtimeMs, ctimeMs, mtimeMs, size} = info;
  const stat = `${parseInt(birthtimeMs/1000, 10)}-${parseInt(ctimeMs/1000, 10)}-${parseInt(mtimeMs/1000, 10)}-${size}`
  return stat
}

function initFileStat(watchPath, deployPath, fileStatMap) {
  if (!fs.existsSync(watchPath)) {
    console.log('\x1B[31m%s\x1B[0m', '\n监听目录不存在\n');
    return;
  }
  if (!fs.existsSync(deployPath)) {
    console.log('\x1B[31m%s\x1B[0m', '\n部署目录不存在！\n');
    return;
  }

  fs.readdir(watchPath, 'utf-8', async (err, data) => {
    data.map(item => {
      const info = fs.statSync(path.resolve(watchPath, item))

      if (info.isFile()) {
        fileStatMap.set(item, getStatInfo(info))
        console.log(`fileStatMap: `, fileStatMap)
      }
    })

    await watch(watchPath, deployPath, fileStatMap)
  })
}

async function main() {
  watchAndDeployPath.map(item => {
    initFileStat(item.watchPath, item.deployPath, item.fileStatMap)
  })
}

async function watch(watchPath, deployPath, fileStatMap) {
  fs.watch(watchPath, {}, async (eventType, filename) => {
    const curFilePath = path.resolve(watchPath, filename)

    if (!fs.existsSync(curFilePath)) {
      console.log('\x1B[32m%s\x1B[0m', `删除了文件: ${curFilePath}\n`, );
      return
    }
    const info = fs.statSync(curFilePath)
    
    const stat = getStatInfo(info)
    const originStat = fileStatMap.get(filename)

    if (originStat !== stat) {
      fileStatMap.set(filename, stat)
      console.log('\x1B[32m%s\x1B[0m', `stat: ${stat}`);
      console.log('\x1B[32m%s\x1B[0m', `originStat: ${originStat}\n`);
      try {
        await deploy(filename, watchPath, deployPath)
      } catch(err) {
        console.log(`err: ${err}`)
      }
    }
  })
}

async function deploy(filename, watchPath, deployPath,) {
  // 默认都是以 .tar.gz 结尾

  const project = filename.replace(/\.tar\.gz$/, '')
  const targetDir = path.resolve(deployPath, project)
  const sourceFile = path.resolve(watchPath, filename);

  if (!fs.existsSync( sourceFile ) ) {
    return
  }

  if (!fs.existsSync( targetDir ) ) {
    await execa.command(`mkdir ${targetDir}`);
  }

  await unzip(targetDir, sourceFile)
  
  // 以 backend 结尾则证明是后端项目，还可以补充对启动命令的判断等
  if (project.endsWith('backend') || pm2ConfigExist(targetDir)) {
    console.log('\x1B[32m%s\x1B[0m', '\n后端项目！\n');
    await deployBackendProject(targetDir)
  }
}

async function unzip(targetDir, sourceFile) {
  console.log('\x1B[32m%s\x1B[0m', `sourceFile: ${sourceFile}`);
  console.log('\x1B[32m%s\x1B[0m', `targetDir: ${targetDir}\n`);

  const { stdout } = await execa.command(`tar -zxvf ${sourceFile} -C ${targetDir}`);
  console.log('\x1B[32m%s\x1B[0m', `stdout: ${stdout}\n`);
}

function pm2ConfigExist(targetDir) {
  return !!fs.existsSync(path.resolve(targetDir, 'ecosystem.config.js'))
}

// 部署NodeJS后台项目
async function deployBackendProject(targetDir) {
  try {
    const { stdout } = await execa.command(`npm install`, {
      cwd: targetDir
    });

    console.log(`stdout: ${stdout}`)

    if (pm2ConfigExist(targetDir)) {
      const { stdout: stdout2 }  = await execa.command(` pm2 start`, {
        cwd: targetDir
       });
      console.log(`stdout2: ${stdout2}`)
    }
  } catch (err) {
    console.log(`${err}`)
  }
}


main()
