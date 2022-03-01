const path = require('path');

const GROUP_WATCH_DEPLOY_PATH = [{
  // 监听目录
  watchPath: '/root/guowangyang/watch-to-deploy-dir',
  // 项目部署目录
  deployPath: '/root/guowangyang/deploy-dir',
}, {
  watchPath: '/root/group/watch-to-deploy-dir',
  deployPath: '/root/group/deploy-dir',
}]

const MY_WATCH_DEPLOY_PATH = [{
  watchPath: '/root/watch-to-deploy-dir',
  deployPath: '/root/deploy-dir',
}]

const DEV_WATCH_DEPLOY_PATH = [{
  watchPath: path.resolve(__dirname, '../.temp'),
  deployPath: path.resolve(__dirname, '../.temp2'),
}, {
  watchPath: path.resolve(__dirname, '../.temp3'),
  deployPath: path.resolve(__dirname, '../.temp5'),
}]

module.exports = {
  GROUP_WATCH_DEPLOY_PATH,
  MY_WATCH_DEPLOY_PATH,
  DEV_WATCH_DEPLOY_PATH
}