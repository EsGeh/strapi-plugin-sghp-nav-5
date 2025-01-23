import "../src/utils";
import * as typeDescr from "../src/typeDescriptions";
import { RetFromArgs } from "../src/utils";


type IsEqual<Type1,Type2> =
	(Type1 | Type2) extends (Type1 & Type2)
	? true
	: never;

function testNoQuery() {
	const query = {} as const;
	type Expected = {
		name: string,
		locale: string,
	};
	type Args = typeof query;
	type RestRet = RetFromArgs<typeDescr.Navigation,Args>;
	// const test: RestRet = undefined as RestRet;
	const ok: IsEqual<RestRet, Expected> = true;
	return ok;
};

function testFields() {
	const query = {
		fields: ["name"],
		// populate: "items"
	} as const;
	type Expected = {
		name: string,
	};
	type Args = typeof query;
	type RestRet = RetFromArgs<typeDescr.Navigation,Args>;
	// const test: RestRet = undefined as RestRet;
	const ok: IsEqual<RestRet, Expected> = true;
	return ok;
};

function testPopulateList() {
	const query = {
		fields: ["name"],
		populate: ["items"]
	} as const;
	type Expected = {
		name: string,
		items: typeDescr.Item["attributes"][],
	};
	type Args = typeof query;
	type RestRet = RetFromArgs<typeDescr.Navigation,Args>;
	// const test: RestRet = undefined as RestRet;
	const ok: IsEqual<RestRet, Expected> = true;
	return ok;
};

function testPopulateSingle() {
	const query = {
		fields: ["name"],
		populate: "items",
	} as const;
	type Expected = {
		name: string,
		items: typeDescr.Item["attributes"][],
	};
	type Args = typeof query;
	type RestRet = RetFromArgs<typeDescr.Navigation,Args>;
	// const test: RestRet = undefined as RestRet;
	const ok: IsEqual<RestRet, Expected> = true;
	return ok;
};

function testPopulateDeep() {
	const query = {
		fields: ["name"],
		populate: {
			items: {
				fields: ["title","path"]
			}
		},
	} as const;
	type Expected = {
		name: string,
		items: {
			title: string,
			path: string,
		}[]
	};
	type Args = typeof query;
	type RestRet = RetFromArgs<typeDescr.Navigation,Args>;
	// const test: RestRet = undefined as RestRet;
	const ok: IsEqual<RestRet, Expected> = true;
	return ok;
};
