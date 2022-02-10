module.exports = {
  apps: [{
    name: 'watch-auto-deploy',
    script: './src/index.js',
    args: 'null',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // log_type: 'json', // 日志格式
    log_date_format: 'YYYY-MM-DD HH:mm:ss', // pm2 log添加日期
    ignore_watch: [
      'output',
    ],
    env: {
      NODE_ENV: 'production',
    },
  }],
};


