module.exports = {
  apps : [
    {
      name: "sghp-nav-test",
      script: 'npm',
			args: 'run develop',
      cwd: 'sghp-nav-test-app',
    },
    {
      name: "sghp-nav",
      script: 'npm',
			args: 'run watch:link',
      cwd: 'sghp-nav',
    }
  ],
};
