# sghp-nav Plugin - Test Backend

Strapi test instance for the sghp-nav plugin.

## Usage

Link with local plugin during development:

    $ WD=$(pwd)
    $ cd <path>/sghp-nav      # <- cd to the plugin dir
    $ npm run watch:link      # recompile
    $ cd "$WD"
    $ npx yalc link sghp-nav  # link to test app

(Same for the frontend types repo)

Now when running the test app, the plugin will be installed and linked from local sources:

    $ npm run develop

In order to watch changes of sghp-nav source code during development, start the watcher process with pm2:

    $ cd ../
    $ pm2 start sghp-nav-compile

Stop the watcher process after you are done:

    $ pm2 stop sghp-nav-compile

## Import Example Data

    $ npm run strapi console
    strapi> $ await strapi.plugin("sghp-nav").service("clientNavigation").addExampleData(); 

## Test sghp-nav Plugin

    $ npm run test
