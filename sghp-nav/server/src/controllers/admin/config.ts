import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  async find(ctx) {
    try {
      ctx.body = await strapi
        .plugin('sghp-nav')
        .service( 'adminConfig' )
        .find()
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

});
