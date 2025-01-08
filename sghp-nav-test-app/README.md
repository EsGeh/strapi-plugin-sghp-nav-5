# sghp-nav plugin - Test App

Strapi test instance for the sghp-nav plugin.

## Usage

Link with local plugin during development:

    $ cd ../sghp-nav
    $ npm run watch:link
    $ cd ../sghp-nav-test-app
    $ npx yalc link sghp-nav

Now when running the test app, the plugin will be installed and linked from local sources:

    $ npm run develop
