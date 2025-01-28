import * as utils from './helpers/strapi';

import * as qs from 'qs';
import * as front from '@sgsoftware/strapi-plugin-sghp-nav-front';
import fetch from "node-fetch";


describe("basic tests", () => {
	beforeAll( async () => {
		return utils.setupStrapi(); 
	});

	afterAll(async () => {
		return utils.stopStrapi(); 
	});

	test('strapi is defined', () => {
		expect(strapi).toBeDefined();
	});

	test('test api/sghp-nav/navigations', async () => {
		const query = {} as const;

		type Args = typeof query;
		const expected: front.RestReturnNavigations<Args> = {
			data: [
				{
					name: "Main",
					locale: "en",
				}
			]
		};
		const queryString = qs.stringify( query );
		return fetch(`http://127.0.0.1:1337/api/sghp-nav/navigations?${queryString}`)
		.then(res => res.json())
		.then(json => {
			expect(json).toMatchObject({
				data: expect.any(Array)
			});
			expect(json.data.length).toBeGreaterThanOrEqual(1);
			expect(json.data[0]).toMatchObject(
				expected.data[0]
			);
		})
	});
});

describe("render example data", () => {

	beforeAll(async () => {
		await utils.setupStrapi();
		await utils.addExampleData();
	});

	afterAll(async () => {
		return utils.stopStrapi(); 
	});

	test('test api/sghp-nav/navigations/render', async () => {
		const query = {} as const;

		type Args = typeof query;
		const expected: front.RestReturnRender<Args> = {
			data: [
				{
					name: "Main",
					locale: "en",
					items: [
						{
							"title": "Home",
							"path": "/",
							"subItems": []
						},
						{
							"title": "Products",
							"path": "/products",
							"subItems": [
								{
									"title": "Product X",
									"path": "/products/product-x",
									"subItems": []
								}
							]
						},
						{
							"title": "Contact",
							"path": "/contact",
							"subItems": []
						}
					],
				}
			]
		};
		const queryString = qs.stringify( query );
		return fetch(`http://127.0.0.1:1337/api/sghp-nav/navigations/render?${queryString}`)
		.then(res => res.json())
		.then(json => {
			expect(json).toMatchObject({
				data: expect.any(Array)
			});
			expect(json.data.length).toBeGreaterThanOrEqual(1);
			expect(json.data[0]).toMatchObject(
				expected.data[0]
			);
		})
	});

});

describe("render with related", () => {

	beforeAll(async () => {
		await utils.setupStrapi();
		await utils.exampleDataWithRelated();
	});

	afterAll(async () => {
		return utils.stopStrapi(); 
	});

	test('test with ?populateRelated=true', async () => {

		const query = {
			populateRelated: true
		} as const;

		type Args = typeof query;
		type PageType = { title: string, content: string };
		const expected: front.RestReturnRender<Args, PageType> = {
			data: [
				{
					name: "Main",
					locale: "en",
					items: [
						{
							"title": "Home",
							"path": "/",
							"subItems": [],
							related: {
								title: "Homepage",
								content: "Lorem Ipsum",
							},
						},
						{
							"title": "Products",
							"path": "/products",
							related: null,
							"subItems": [
								{
									"title": "Product X",
									"path": "/products/product-x",
									"subItems": [],
									related: null,
								}
							]
						},
						{
							"title": "Contact",
							"path": "/contact",
							"subItems": [],
							related: null,
						}
					],
				}
			]
		};
		const argsString = qs.stringify( query );

		const url = `http://127.0.0.1:1337/api/sghp-nav/navigations/render?${argsString}`;
		console.log( url );
		return fetch( url )
		.then(res => res.json())
		.then(json => {
			expect(json).toMatchObject({
				data: expect.any(Array)
			});
			expect(json.data.length).toBeGreaterThanOrEqual(1);
			expect(json.data[0]).toMatchObject(
				expected.data[0]
			);
		})
	});

	test('test with ?populateRelated={ fields:<...> }', async () => {

		const query = {
			populateRelated: {
				fields: ["title"]
			}
		} as const;

		type Args = typeof query;
		type PageType = { title: string };
		const expected: front.RestReturnRender<Args, PageType> = {
			data: [
				{
					name: "Main",
					locale: "en",
					items: [
						{
							"title": "Home",
							"path": "/",
							"subItems": [],
							related: {
								title: "Homepage"
							},
						},
						{
							"title": "Products",
							"path": "/products",
							related: null,
							"subItems": [
								{
									"title": "Product X",
									"path": "/products/product-x",
									"subItems": [],
									related: null,
								}
							]
						},
						{
							"title": "Contact",
							"path": "/contact",
							"subItems": [],
							related: null,
						}
					],
				}
			]
		};
		const argsString = qs.stringify( query );

		const url = `http://127.0.0.1:1337/api/sghp-nav/navigations/render?${argsString}`;
		console.log( url );
		return fetch( url )
		.then(res => res.json())
		.then(json => {
			expect(json).toMatchObject({
				data: expect.any(Array)
			});
			expect(json.data.length).toBeGreaterThanOrEqual(1);
			// check returned data is a superset of expected data:
			expect(json.data[0]).toMatchObject(
				expected.data[0]
			);
			// check related is populated correctly:
			const entriesWithRelated = json.data[0].items.filter((x:any) => x.related);
			expect(entriesWithRelated.length).toBeGreaterThan(0);
			entriesWithRelated.map( (item:any) => {
				expect(item.related).toEqual({
					title: expect.any(String),
					// these fields may still be included:
					id: expect.any(Number),
					documentId: expect.any(String),
				})
			});
		})
	});

});
