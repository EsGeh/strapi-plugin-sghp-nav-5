import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::sghp-nav.item', ({ strapi }) =>  ({

  async find(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const {results, pagination} = await strapi
      .plugin('sghp-nav')
      .service('clientItem')
      .find(sanitizedQueryParams);
    const sanitizedResults = results;
    // const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults, { pagination });
  },

} ));
