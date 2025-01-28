import { Config } from "../../../impl/config";
import * as typeUtils from "../../../impl/types/utils";
import * as utils from "../../../impl/utils";

import { factories } from '@strapi/strapi';
import { merge } from 'lodash';
import { RawIntlProvider } from 'react-intl';

export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  getWelcomeMessage() {
    return 'Welcome to sghp-nav plugin 5';
  },

  async renderAll(
    params
  ) {
    const config: Config = strapi.config.get('plugin::sghp-nav');
    let findArgs: Record<string,any> = merge(
      Private.findRawArgs,
      {
        populate: {
          items: {
            populate: {
              related: params?.populateRelated || false
            }
          }
        }
      }
    );
    if( params.locale ) {
      findArgs.locale = params.locale;
    }

    // we dont actually know "typeof findArgs"
    // because we dont know how the related
    // field is populated.
    // We therefore assume a type
    // that is close enough.
    //

    const rawFindRet = await super.find( findArgs );
    const renderedNavs = rawFindRet.results.map( nav => {
      const structuredNavData = utils.fromFlatItems(
        nav.items
      );
      const renderedItems = typeUtils.renderPathsItems(
        structuredNavData,
        config.hierarchicalPaths,
      );
      return {
        ...nav,
        items: renderedItems,
      }
    })
    return {
      results: renderedNavs,
      pagination: rawFindRet.pagination
    };
  },

  async find(
    ...params
  ) {
    const {results, pagination} = await super.find(...params);
    return {results, pagination};
  },

  /*
  // create default navigation:
  async addNavigation(
    name: string = "Main"
  )
  {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    let mainEntry = await navDocuments.findMany({
      filters: {
        name: name
      }
    });
    if( !mainEntry || mainEntry.length == 0 ) {
      console.info( "sghp-nav: creating default navigation..." );
      const navigationDocument = await navDocuments.create({
        data: {
          name: name
        },
      });
    }
  },

  async addExampleData()
  {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    const itemDocuments = strapi.documents('plugin::sghp-nav.item');
    let mainNavigation = await navDocuments.findFirst({
      filters: {
        name: "Main"
      }
    });
    // create test items:
    if( mainNavigation  ) {
      const items = await itemDocuments.findMany({
        filters: {
          master: mainNavigation
        }
      });
      if( items && items.length != 0 ) {
        return;
      }
      console.info( "creating test data..." );
      await itemDocuments.create({
        data: {
          title: "Home",
          path: "",
          order: 0,
          master: mainNavigation,
        }
      });
      const productsItem = await itemDocuments.create({
        data: {
          title: "Products",
          path: "products",
          order: 1,
          master: mainNavigation,
        }
      });
      await itemDocuments.create({
        data: {
          title: "Product X",
          path: "product-x",
          order: 0,
          parent: productsItem,
          master: mainNavigation,
        }
      });
      await itemDocuments.create({
        data: {
          title: "Contact",
          path: "contact",
          order: 2,
          master: mainNavigation,
        }
      });
    }
  }
  */

}));

namespace Private {
  export const findRawArgs = {
    populate: {
      items: {
        sort: 'order',
        populate: {
          subItems: {
            fields: ['id'],
            sort: 'order',
          },
          parent: {
            fields: ['id'],
          },
        },
      },
    },
  } as const;
}
