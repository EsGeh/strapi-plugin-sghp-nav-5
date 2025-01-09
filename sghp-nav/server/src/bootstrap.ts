import type { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
  const itemDocuments = strapi.documents('plugin::sghp-nav.item');
  // clear orphaned items:
  {
    console.info( `looking for orphaned items...` );
    const items = await itemDocuments.findMany({
      filters: {
        master: null
      }
    });
    if( items && items.length != 0 ) {
      console.info( `found ${ items.length } orphaned items. Deleting...` );
      for( const item of items ) {
        itemDocuments.delete({ documentId: item.documentId });
      }
    }
  }
  // create default navigation:
  let mainEntry = await navDocuments.findMany({
    filters: {
      name: "Main"
    }
  });
  if( !mainEntry || mainEntry.length == 0 ) {
    console.info( "sghp-nav: creating default navigation..." );
    const navigationDocument = await navDocuments.create({
      data: {
        name: "Main"
      },
    });
  }
};

export default bootstrap;
