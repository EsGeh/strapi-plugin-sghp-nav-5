import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('sghp-nav')
      // the name of the service file & the method.
      .service('clientService')
      .getWelcomeMessage();
  },
  renderAll(ctx) {
    ctx.body = strapi
      .plugin('sghp-nav')
      // the name of the service file & the method.
      .service('clientService')
      .getWelcomeMessage();
  },
});

export default controller;
