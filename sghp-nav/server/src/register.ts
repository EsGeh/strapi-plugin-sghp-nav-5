import { Config } from './config';

import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  const config: Config = strapi.config.get('plugin::sghp-nav');
  const relatedType = config.relatedType as any; // <- fix type safety
  strapi.contentType( 'plugin::sghp-nav.item' ).attributes.related = {
    "type": "relation",
    relation: "oneToOne",
    target: relatedType,
  };
};

export default register;
