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

module.exports = {
  getWatchAndDeployPath
}
