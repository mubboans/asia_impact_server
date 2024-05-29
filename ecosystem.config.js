module.exports = {
  apps: [{
    script: 'npm start',

  }],

  deploy: {
    production: {
      key: "asia_ubuntu_uat.pem",
      user: 'ubuntu',
      host: '54.161.183.125',
      ref: 'origin/main',
      repo: 'git@github.com:digitalsalt-tech/asiaimpact-api.git',
      path: '/home/ubuntu/asiaimpact-api',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
