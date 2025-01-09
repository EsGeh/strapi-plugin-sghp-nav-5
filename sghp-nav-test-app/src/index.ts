import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
		/* 
		 * setup some example data
		 * for the nav plugin:
		 */
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
  	let mainEntry = await navDocuments.findMany();
		if( !mainEntry || mainEntry.length == 0 ) {
    	console.info( "sghp-nav: creating default navigations..." );
			const navigationDocument = await navDocuments.create({
				data: {
					name: "Main"
				},
			});
			// create test items:
			{
				await itemDocuments.create({
					data: {
						title: "Home",
						path: "",
						order: 0,
						master: navigationDocument,
					}
				});
				const productsItem = await itemDocuments.create({
					data: {
						title: "Products",
						path: "products",
						order: 1,
						master: navigationDocument,
					}
				});
				await itemDocuments.create({
					data: {
						title: "Product X",
						path: "product-x",
						order: 0,
						parent: productsItem,
						master: navigationDocument,
					}
				});
				await itemDocuments.create({
					data: {
						title: "Contact",
						path: "contact",
						order: 2,
						master: navigationDocument,
					}
				});
			}
		}
	},
};
