import { createStrapi } from '@strapi/strapi';
import { Core } from '@strapi/types';

import * as fs from 'fs';

let instance: Core.Strapi | null;

/* For details about creating
 * a strapi instance, see:
 *
 * - https://github.com/strapi/strapi/blob/develop/tests/api/core/strapi/api/ 
 * - https://github.com/strapi/strapi/blob/develop/packages/utils/api-tests/strapi.js 
 *
 */

export async function setupStrapi() {
  if (!instance) {
		const options = {
			appDir: ".",
			distDir: 'dist',
		};
    instance = createStrapi(options);
		// bypass auth:
    instance.get('auth').register('content-api', {
      name: 'test-auth',
      authenticate() {
        return { authenticated: true };
      },
      verify() {},
    });
		const si = await instance.load();
		await si.start();
		// console.log("STRAPI RUNNING");
  }
  return instance;
}

export async function stopStrapi() {
	const dbSettings = strapi.config.database.connection.connection;
	await strapi.server.destroy();
	// This will delete test database after all tests
	if (dbSettings && dbSettings.filename) {
		const tmpDbFile = `${dbSettings.filename}`;
		if (fs.existsSync(tmpDbFile)) {
			fs.unlinkSync(tmpDbFile);
		}
	}
	await instance?.destroy();
	instance = null;
}

/* 
 * setup some example data
 * for the nav plugin:
 */
export async function addExampleData() {
	const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
	const itemDocuments = strapi.documents('plugin::sghp-nav.item');
	const pageDocuments = strapi.documents('api::page.page');
	{
		const main = await navDocuments.findFirst({ filters: { name: "Main" } });
		if( main ) {
			throw Error("Main navigation already existing!");
		}
	}
	const mainNavigation = await navDocuments.create({
		data: {
			name: "Main"
		}
	});
	const items = await itemDocuments.findMany({
		filters: {
			master: {
				id: mainNavigation.id
			}
		}
	});
	if( items && items.length != 0 ) {
		console.error( JSON.stringify( items ) );
		throw Error("items already existing");
		// return;
	}
	const homeItem = await itemDocuments.create({
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

/* 
 * setup some example data
 * for the nav plugin:
 */
export async function exampleDataWithRelated() {
	const pageDocuments = strapi.documents('api::page.page');
	const navDocuments = strapi.documents('plugin::sghp-nav.navigation');
	const itemDocuments = strapi.documents('plugin::sghp-nav.item');
	{
		const main = await navDocuments.findFirst({ filters: { name: "Main" } });
		if( main ) {
			throw Error("Main navigation already existing!");
		}
	}
	const mainNavigation = await navDocuments.create({
		data: {
			name: "Main"
		}
	});
	// create test items:
	const items = await itemDocuments.findMany({
		filters: {
			master: {
				id: mainNavigation.id
			}
		}
	});
	if( items && items.length != 0 ) {
		console.error( JSON.stringify( items ) );
		throw Error("items already existing");
		// return;
	}
	const homepage = await pageDocuments.create({
		data: {
			title: "Homepage",
			content: "Lorem Ipsum",
		},
		status: "published"
	});
	const homeItem = await itemDocuments.create({
		data: {
			title: "Home",
			path: "",
			order: 0,
			master: mainNavigation,
			related: homepage,
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
