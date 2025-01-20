import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({

  async renderAll(ctx) {
    // await this.validateQuery(ctx);
    const query = await this.sanitizeQuery(ctx);
    const results = await strapi
      .plugin('sghp-nav')
      .service('adminNavigation')
      .renderAll( query );
    const sanitizedResults = results;
    // const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse( sanitizedResults );
  },

  async update(ctx) {
    const query = await this.sanitizeQuery(ctx);
    const documentId = ctx.params.documentId;
    const data = {
      ...ctx.request.body,
      id: undefined,
      documentId: undefined,
    };
    const results = await strapi
      .plugin('sghp-nav')
      .service('adminNavigation')
      .update(
        documentId,
        data,
        query
      );
    const sanitizedResults = results;
    ctx.body = {};
  },

} ));
