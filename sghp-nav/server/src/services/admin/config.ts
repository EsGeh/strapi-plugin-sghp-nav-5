import { Config } from '../../config';

import type { Core } from '@strapi/strapi';


export default ({ strapi }: { strapi: Core.Strapi }) => ({

  find: async () => {
    const config: Config = strapi.config.get('plugin.sghp-nav');
    return config;
  },
});
