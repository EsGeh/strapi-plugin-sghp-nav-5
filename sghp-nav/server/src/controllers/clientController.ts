import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({
  index(ctx) {
    ctx.body = strapi
      .plugin('sghp-nav')
      .service('clientService')
      .getWelcomeMessage();
  },
  async find(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const { results, pagination } = await strapi
      .plugin('sghp-nav')
      .service('clientService')
      .find(sanitizedQueryParams);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });
  },

  async renderAll(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const {results, pagination} = await strapi
      .plugin('sghp-nav')
      .service('clientService')
      .renderAll( sanitizedQueryParams );
    const sanitizedResults = results;
    return this.transformResponse( sanitizedResults, { pagination });
  },

} ));
