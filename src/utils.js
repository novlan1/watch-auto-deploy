const path = require('path');
const { readEnv } = require('read-file-env')
const { 
  MY_WATCH_DEPLOY_PATH, 
  GROUP_WATCH_DEPLOY_PATH, 
  DEV_WATCH_DEPLOY_PATH 
} = require('./config');

const ENV_FILE_NAME = '.env.local'
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
  const hostName = readEnv('hostName', path.resolve(__dirname, `../${ENV_FILE_NAME}`));
  console.log('\x1B[33m%s\x1B[0m', `hostName: ${hostName}\n`);

  if (hostName.endsWith('54.128')) {
    return true;
  }
  return false
}

module.exports = {
  getWatchAndDeployPath,
  judgeGroup,
}
