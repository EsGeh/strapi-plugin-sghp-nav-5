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
