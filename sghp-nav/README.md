# Strapi Plugin sghp-nav 5

Plugin for [Strapi](https://strapi.io/) to create, edit and retrieve website navigation structure.

# Features:

- Graphical user interface for editing site navigation
- i18n, Nationalization: seperate navigation for every locale
- Multiple independent navigations supported (footer, etc)
- Configurable via config file
- Strapi conformant REST API to fetch hierarchical menu data
- Typescript types for REST responses included
- Navigation items may be associated with a custom content type (ie. that represents a page or section on your website)
- Import / Export of navigation structure via strapis native command line tools

# Requirements

- Strapi 5

This is the strapi *5 version* of the older project [strapi-plugin-sghp-nav](https://github.com/EsGeh/strapi-plugin-sghp-nav), which was compatible with strapi version 4.

# Configuration

Add plugin config to `./config/plugins.ts` (create, if not yet existing):

    ...
    'sghp-nav': {
      enabled: true,
      config: {
        relatedType: 'api::page.page',
        relatedDisplayField: 'title',
        hierarchicalPaths: true,
      }
    }

Adjust the values as necessary!

Configuration Options:

- `relatedType`: Menu entries may be associated with entities of a custom content type, e.g. a subpage. Refers to a content type via "strapi uid" in the same format as in [strapis entity service api](https://docs.strapi.io/dev-docs/api/entity-service). `$ npm run strapi content-types:list` lists all content types.
- `relatedDisplayField`: a field of the related type used to display related content in the graphical user interface
- `hierarchicalPaths`: Menu entries consist of a title and a path. The path must be unique. If `hierarchicalPaths` is true, the path of subentries is the concatenation with the path of their parents, e.g. if `/productX` is a subentry of `/products`, the full path is `/products/productX`

# REST API

Example Query:

  $ curl -X GET 'http://localhost:1337/api/sghp-nav/navigations/render'

Example Response:

  {
    "data": [
      {
        "id": 6,
        "documentId": "csfeocqquqz2bekl1xycrfkh",
        "name": "Main",
        "createdAt": "2025-01-09T22:06:55.493Z",
        "updatedAt": "2025-01-09T22:06:55.493Z",
        "publishedAt": "2025-01-09T22:06:55.489Z",
        "locale": "en",
        "items": [
          {
            "id": 13,
            "title": "Home",
            "path": "/",
            "subItems": []
          },
          {
            "id": 14,
            "title": "Products",
            "path": "/products",
            "subItems": [
              {
                "id": 15,
                "title": "Product X",
                "path": "/products/product-x",
                "subItems": []
              }
            ]
          },
          {
            "id": 16,
            "title": "Contact",
            "path": "/contact",
            "subItems": []
          }
        ]
      }
    ],
    "meta": {

    }
  }

Request Format:

    http://localhost:1337/api/sghp-nav/navigations/render?<PARAMS>

Get Params:

- `locale`: Query the navigation for a specific locale. If unspecified, returns default locale
- `populateRelated`: specifies what information to return for related entities. The format is exactly as in a [REST request](https://docs.strapi.io/dev-docs/api/rest/parameters) for the corresponding content type. Most notable operators are: `populate` and, `fields`.

# Contribution

Comments, bug reports and pull requests welcome.
Effort has been taken towards well structured code that should be easy to extend and improve.

This plugin was born from practical considerations and aims to close some gaps of other existing solutions which seemed to fail the folllowing requirements (as of 2023-09-11):

- Import / Export via strapis native command line tools ([without breaking relations](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation/issues/317))
- Internationalization (missing in `strapi-plugin-menus`)
