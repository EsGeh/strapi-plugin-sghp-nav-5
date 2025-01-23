import * as types from "../../../impl/types/admin";
import * as typeUtils from "../../../impl/types/utils";
import * as db from "../../../impl/types/db";
import { Config } from '../../config';

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';


export default factories.createCoreService('plugin::sghp-nav.item', ({ strapi }) =>  ({

  // implicitly update
  // 'master' and 'order' properties
  async create( params )
  {
    const config: Config = strapi.config.get('plugin::sghp-nav');
    // locale -> master navigation
    let nav: types.Navigation
    {
      let getNavArgs: { [k:string]: any} = {};
      if( params?.locale ) {
        getNavArgs.locale = params?.locale;
      }
      const navs: types.Navigation[] = await strapi.service("plugin::sghp-nav.adminNavigation").renderAll( getNavArgs );
      nav = navs.find( x => (x.id == params.master) );
    }
    if( !nav ) {
      throw new errors.NotFoundError('Navigation not found');
    }
    let itemToAdd = {
      ...params,
      master: nav.id,
    };
    // Check if operation leads to valid results:
    const parentId: number|undefined = params.parent;
    const parent = typeUtils.findItem( nav, (item) => (item.id === parentId) );
    const order = typeUtils.addItem( nav, itemToAdd, parent );
    itemToAdd.order = order;
    const validationErrors: string[] = typeUtils.validate( nav, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    return strapi.documents("plugin::sghp-nav.item").create({
      data: itemToAdd
    });
  },

  async update(
    documentId: string,
    item: Partial<types.NavItem>,
    // params: { data: Partial<types.NavItem> },
  )
  {
    const config: Config = strapi.config.get('plugin::sghp-nav');
    const nav = await this.getNavigationFromItem( documentId );
    const oldItem = typeUtils.findItemByDocumentId(
      nav,
      documentId,
    );
    for( const fieldName of ["title", "path", "related"] ) {
      if( item[fieldName] )
        oldItem[fieldName] = item[fieldName];
    }
    // Check if operation leads to valid results:
    const validationErrors: string[] = typeUtils.validate( nav, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    return super.update( documentId, {
      data: item
    });
  },

  async getNavigationFromItem(
    documentId: string,
  ):
    Promise<types.Navigation>
  {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    const itemDocuments = strapi.documents('plugin::sghp-nav.item');
    const config: Config = strapi.config.get('plugin::sghp-nav');
    let master: db.NavFromDB
    {
      let itemRequest = await itemDocuments.findOne({
        documentId: documentId,
        populate: {
          master: {
            populate: {
              items: Private.populateItemsRender(),
            }
          }
        }
      });
      master = itemRequest.master;
    };
    const ret = await strapi.service( 'plugin::sghp-nav.adminNavigation' ).getNavigationFromFlat(
      master
    );
    return ret;
  },

}));

namespace Private {

  export function populateItemsRender( related: boolean= true )
  {
    return {
      fields: ["title", "path", ],
      sort: 'order',
      populate: {
        subItems: {
          fields: ['id'],
          sort: 'order',
        },
        parent: {
          fields: ['id'],
        },
        related: related,
      },
    }
  };
}
