module.exports = {
  apps : [
    {
      name: "sghp-nav-compile",
      script: 'npm',
			args: 'run watch:link',
      cwd: 'sghp-nav',
    },
    {
      name: "test-backend",
      script: 'npm',
			args: 'run develop',
      cwd: 'test/strapi-backend',
    },
  ],
};
