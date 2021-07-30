'use strict';

module.exports = {
  apps: [
    {
      name: 'developic',
      script: './build/app.js',
      watch: true,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
