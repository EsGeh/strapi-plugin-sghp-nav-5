import * as utils from './helpers/strapi';

import * as qs from 'qs';
import * as front from '@sgsoftware/strapi-plugin-sghp-nav-front';
// const st = require('supertest');
import fetch from "node-fetch";


// this code is called once before any test:
beforeAll(() => {
  return utils.setupStrapi(); 
});

// this code is called after all the tests are finished:
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
  /*
	st("http://127.0.0.1:1337")
		.get("/api/sghp-nav/navigations")
		.expect(200)
		.then(data => {
			expect(data.text).toBe("bla");
		});
	*/
});

describe("render example data", () => {

	beforeEach(() => {
		return utils.addExampleData();
	});

	test('test api/sghp-nav/navigations/render', async () => {
		const query = {} as const;

		type Args = typeof query;
		const expected: front.RestReturnRender = {
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
