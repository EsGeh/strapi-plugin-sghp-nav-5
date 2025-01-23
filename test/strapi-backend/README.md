# sghp-nav Plugin - Test Backend

Strapi test instance for the sghp-nav plugin.

## Usage

Link with local plugin during development:

    $ WD=$(pwd)
    $ cd <path>/sghp-nav      # <- cd to the plugin dir
    $ npm run watch:link      # recompile
    $ cd "$WD"
    $ npx yalc link sghp-nav  # link to test app

Now when running the test app, the plugin will be installed and linked from local sources:

    $ npm run develop

In order to watch changes of sghp-nav source code during development, start the watcher process with pm2:

    $ cd ../
    $ pm2 start sghp-nav

Stop the watcher process after you are done:

    $ pm2 stop sghp-nav
