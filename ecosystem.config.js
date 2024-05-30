module.exports = {
  apps: [
    {
      name: "asiaimpact-api",
      script: "./server.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      key: "asia_ubuntu_uat.pem",
      user: 'ubuntu',
      host: '54.161.183.125',
      ref: 'origin/main',
      repo: 'git@github.com:digitalsalt-tech/asiaimpact-api.git',
      path: '/home/ubuntu/asiaimpact-api',
      'pre-deploy-local': '',
      'pre-deploy': 'git fetch --all && git reset --hard origin/main',
      'post-deploy': 'cd /home/ubuntu/asiaimpact-api && cp -a source/. . && echo "Copy successful" || echo "Copy failed" && npm install && echo "NPM install successful" || echo "NPM install failed" && pm reload ecosystem.config.js --env production && echo "PM2 reload successful" || echo "PM2 reload failed" && rm -rf source && echo "Source removal successful" || echo "Source removal failed"',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
