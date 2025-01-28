import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::sghp-nav.navigation', ({ strapi }) =>  ({
  index(ctx) {
    ctx.body = strapi
      .plugin('sghp-nav')
      .service('navigation')
      .getWelcomeMessage();
  },
  async find(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const {results, pagination} = await strapi
      .plugin('sghp-nav')
      .service('navigation')
      .find(sanitizedQueryParams);
    const sanitizedResults = results;
    /* the following doesn't work -
     * will purge related entities,
     * such as items if "populate=items": */
    // const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });
  },

  async renderAll(ctx) {
    await this.validateQuery(ctx);
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const {results, pagination} = await strapi
      .plugin('sghp-nav')
      .service('navigation')
      .renderAll( sanitizedQueryParams );
    const sanitizedResults = results;
    /* the following doesn't work -
     * will purge related entities,
     * such as items if "populate=items": */
    // const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse( sanitizedResults, { pagination });
  },

} ));
