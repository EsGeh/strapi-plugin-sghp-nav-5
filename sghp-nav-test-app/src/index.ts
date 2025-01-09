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
		let mainNavigation = await navDocuments.findFirst({
			filters: {
				name: "Main"
			}
		});
		// create test items:
		if( mainNavigation  ) {
			const items = await itemDocuments.findMany({
				filters: {
					master: mainNavigation
				}
			});
			if( items && items.length != 0 ) {
				return;
			}
    	console.info( "creating test data..." );
			await itemDocuments.create({
				data: {
					title: "Home",
					path: "",
					order: 0,
					master: mainNavigation,
				}
			});
			const productsItem = await itemDocuments.create({
				data: {
					title: "Products",
					path: "products",
					order: 1,
					master: mainNavigation,
				}
			});
			await itemDocuments.create({
				data: {
					title: "Product X",
					path: "product-x",
					order: 0,
					parent: productsItem,
					master: mainNavigation,
				}
			});
			await itemDocuments.create({
				data: {
					title: "Contact",
					path: "contact",
					order: 2,
					master: mainNavigation,
				}
			});
		}
	},
};
