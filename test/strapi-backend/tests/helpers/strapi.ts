import { createStrapi } from '@strapi/strapi';
import { Core } from '@strapi/types';

import * as fs from 'fs';

let instance: Core.Strapi | null;

export async function setupStrapi() {
  if (!instance) {
		const options = {
			appDir: ".",
			distDir: 'dist',
		};
    instance = createStrapi(options);
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
	return strapi
		.plugin("sghp-nav")
		.service("clientNavigation")
		.addExampleData();
}

/* 
 * setup some example data
 * for the nav plugin:
 */
export async function exampleDataWithRelated() {
	const pageDocuments = strapi.documents('api::page.page');
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
		console.info( "creating test data..." );
		const homepage = await pageDocuments.create({
			data: {
				title: "Homepage",
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
}
