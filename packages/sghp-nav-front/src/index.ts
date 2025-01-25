import * as typeDescr from "./typeDescriptions";
import * as utils from "./utils";


// url: /sghp-nav/navigations
export type RestReturnNavigations<Args> = {
	data: utils.RetFromArgs<typeDescr.Navigation,Args>[]
};

// url: /sghp-nav/items
export type RestReturnItems<Args> = {
	data: utils.RetFromArgs<typeDescr.Item,Args>[]
};

// url: /sghp-nav/navigations/render
export type RestReturnRender = {
	data: NavToRenderedNav<utils.RetFromArgs<typeDescr.Navigation,RenderArgs>>[]
};

type NavToRenderedNav<Nav> = {
	[Key in keyof Nav]:
		Key extends "items"
		? ItemWithChildren[]
		: Nav[Key]
};

const populateRender = {
	populate: {
		items: {
			populate: ["subItems"]
		}
	}
} as const;

type RenderArgs = typeof populateRender;
type RenderItemArgs = RenderArgs["populate"]["items"];

type ItemWithChildren = PopulateSubItemsRec<
	utils.RetFromArgs<
		typeDescr.ItemRendered,
		RenderItemArgs
	>
>;

type PopulateSubItemsRec<Item> = {
	[Key in keyof Item]:
		Key extends "subItems"
		? ItemWithChildren[]
		: Item[Key]
};

// const test: RestReturnRender;
