const { 
  MY_WATCH_DEPLOY_PATH, 
  GROUP_WATCH_DEPLOY_PATH, 
  DEV_WATCH_DEPLOY_PATH 
} = require('./config');

const isDev = process.env.NODE_ENV !== 'production';

function getWatchAndDeployPath(isGroup) {
  let list = MY_WATCH_DEPLOY_PATH;
  if (isDev) {
    list = DEV_WATCH_DEPLOY_PATH;
  } else if (isGroup) {
    list = GROUP_WATCH_DEPLOY_PATH;
  }

  return list.map(item => ({
    ...item,
    fileStatMap: new Map()
  }));
}

function judgeGroup() {
  const ip = getIPAddress() || '';
  console.log('\x1B[33m%s\x1B[0m', `ip: ${ip}\n`);
  
  if (ip.endsWith('54.128')) {
    return true;
  }
  return false
}

function getIPAddress() {
  const interfaces = require('os')
    .networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  getWatchAndDeployPath,
  judgeGroup,
}
