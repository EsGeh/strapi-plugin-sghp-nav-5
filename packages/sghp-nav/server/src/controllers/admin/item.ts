import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::sghp-nav.item', ({ strapi }) =>  ({

  /* default create would
   * throw away 'related'
   * field.
   * Therefore overwrite:
   */
  async create(ctx) {
    const query = await this.sanitizeQuery(ctx);
    const documentId = ctx.params.documentId;
    try {
      const data = ctx.request.body;
      if( !data ) {
        throw Error("invalid request: empty data");
      }
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminItem' ).create(
        data
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    const query = await this.sanitizeQuery(ctx);
    const documentId = ctx.params.documentId;
    try {
      const params = ctx.params;
      const data = ctx.request.body;
      if( !data ) {
        throw Error("invalid request: empty data");
      }
      ctx.body = await strapi.service( 'plugin::sghp-nav.adminItem' ).update(
        params.documentId,
        data
      );
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

} ));
