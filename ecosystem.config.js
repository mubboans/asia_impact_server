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
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
