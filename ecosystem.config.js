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
      repo: 'git@github.com:digitalsalt-tech/asiaimpact-api.git', // Ensure SSH URL is used
      path: '/home/ubuntu/asiaimpact-api',
      'pre-deploy-local': '',
      'pre-deploy': 'git fetch --all && git reset --hard origin/main',
      'post-deploy': 'npm install && pm2 reload /home/ubuntu/asiaimpact-api/ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
