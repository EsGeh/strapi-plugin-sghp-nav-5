import { Config } from "../../../impl/config";
import * as typeUtils from "../../../impl/types/utils";
import * as utils from "../../../impl/utils";

import { factories } from '@strapi/strapi';
import { merge } from 'lodash';
import { RawIntlProvider } from 'react-intl';

export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAll(
    params
  ) {
    // TODO: populate related!!
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
      return {
        ...nav,
        items: structuredNavData,
      }
    })
    return renderedNavs;
  },

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
