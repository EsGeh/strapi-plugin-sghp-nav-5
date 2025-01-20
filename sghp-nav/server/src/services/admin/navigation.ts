import { Config } from "../../../impl/config";
import * as types from "../../../impl/types/admin";
import * as db from "../../../impl/types/db";
import * as typeUtils from "../../../impl/types/utils";
import * as utils from "../../../impl/utils";

import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { merge } from 'lodash';
import { RawIntlProvider } from 'react-intl';

export default factories.createCoreService('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAll(
    params
  )
    : Promise<types.Navigation[]>
  {
    const config: Config = strapi.config.get('plugin::sghp-nav');
    let findArgs: Record<string,any> = merge(
      Private.findRawArgs,
      {
        populate: {
          items: Private.populateItemsRender(),
        }
      },
    );
    if( params.locale ) {
      findArgs.locale = params.locale;
    }
    let findRet: { results: db.NavFromDB[] } = await super.find( findArgs );
    const renderedNavs: types.Navigation[] = await Promise.all(findRet.results.map( async (navData) : Promise<types.Navigation> => {
      return await this.getNavigationFromFlat( navData, params?.locale );
    }));
    return renderedNavs;
  },

  async create(
    data: Pick<types.Navigation,"name">,
    locale: string,
  ) {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    if( !data.name ) {
      throw new errors.NotFoundError('expected: { name, locale }');
    }
    const createArgs = {
      data: data,
      locale: locale,
    }
    const newEntry = await navDocuments.create( createArgs )
    return newEntry;
  },

  async del(
    documentId: string,
    locale: string,
  ) {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    const newEntry = await navDocuments.delete({
      documentId: documentId,
      locale: locale
    });
    return newEntry;
  },

  async update(
    documentId: string,
    data: types.Navigation,
  ) {
    const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
    const itemDocuments = strapi.documents('plugin::sghp-nav.item');
    const config: Config = strapi.config.get('plugin::sghp-nav');
    const validationErrors: string[] = typeUtils.validate( data, config.hierarchicalPaths );
    if( validationErrors.length > 0 ) {
      throw new errors.ValidationError(`invalid navigation data: ${ validationErrors.join() }`);
    }
    let navData: types.Navigation = await (async () => {
      const temp = await navDocuments.findOne({
        documentId: documentId,
        populate: {
          items: Private.populateItemsRender(),
        },
        locale: data.locale
      } );
      if( !temp ) {
        throw new errors.NotFoundError('Navigation not found');
      }
      // TODO: validate type:
      return temp as types.Navigation;
    })();
    if( data.name !== navData.name ) {
      // are these the correct parameters??:
      const update: any = {
        ...data
      };
      await navDocuments.update({
        documentId: documentId,
        data: update
      });
    }
    const flatItems = utils.toFlatItems( data.items );
    let updates = [];
    // DELETES:
    const itemsToDel = navData.items.filter( item => ! flatItems.find( x => x.id === item.id ) );
    itemsToDel.forEach( item => {
      updates.push(
        itemDocuments.delete({ documentId: item.documentId })
      );
    });
    flatItems.forEach( item => {
      // CREATE:
      if( ! navData.items.find( x => x.id === item.id  ) ) { }
      // UPDATE
      else {
        const update: any = {
          title: item.title,
          path: item.path,
          order: item.order,
        }
        updates.push(
          itemDocuments.update({
            documentId: item.documentId,
            data: update
          })
        );
      }
    });
    await Promise.all( updates );
  },

  async getNavigationFromFlat(
    navData: db.NavFromDB,
    locale?: string,
  ):
    Promise<types.Navigation>
  {
    const config: Config = strapi.config.get('plugin::sghp-nav');
    type ContentType = any; // TODO: fix type safety
    const relatedEntities: { [key:string]: any } =
      await strapi.documents(config.relatedType as ContentType).findMany({
        fields: [ "id", config.relatedDisplayField ],
        status: "published",
        ...( locale ? { locale } : {} ),
      });
    const renderedItems = utils.adminRenderRelated(
      utils.fromFlatItems(
        navData.items,
      ),
      config.relatedDisplayField,
    );
    return {
      ...navData,
      items: renderedItems,
      relatedEntities: relatedEntities.map( entity => ({
        id: entity.id,
        displayName:
          entity[config.relatedDisplayField] ?? entity.id,
      }) ),
    }
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
