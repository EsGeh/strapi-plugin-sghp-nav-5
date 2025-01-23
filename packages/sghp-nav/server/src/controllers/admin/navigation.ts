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

  async create(ctx) {
    const query = await this.sanitizeQuery(ctx);
    const data = {
      ...ctx.request.body
    };
    const locale: string = ctx.request.body.locale;
    if( !data.name || !locale ) {
      throw Error("expected format: { name, locale }");
    }
    const results = await strapi
      .plugin('sghp-nav')
      .service('adminNavigation')
      .create(
        data,
        locale,
      );
    const sanitizedResults = results;
    ctx.body = {};
  },

  async del(ctx) {
    const query = await this.sanitizeQuery(ctx);
    const documentId = ctx.params.documentId;
    const locale: string|unknown = query.locale;
    if( !documentId ) {
      throw Error("expected params: documentId");
    }
    if( !locale ) {
      throw Error("expected params ?locale=");
    }
    const results = await strapi
      .plugin('sghp-nav')
      .service('adminNavigation')
      .del(
        documentId,
        locale,
      );
    const sanitizedResults = results;
    ctx.body = {};
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
        data
      );
    const sanitizedResults = results;
    ctx.body = {};
  },

} ));
