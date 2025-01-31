import * as typeDescr from "./typeDescriptions";
import * as strapiTypes from "./strapiTypes";


// url: /sghp-nav/navigations
export type RestReturnNavigations<Args> = {
	data: strapiTypes.RetFromArgs<typeDescr.Navigation,Args>[]
};

// url: /sghp-nav/items
export type RestReturnItems<Args> = {
	data: strapiTypes.RetFromArgs<typeDescr.Item,Args>[]
};

// url: /sghp-nav/navigations/render
export type RestReturnRender<Args, Related = never> = {
	data: NavToRenderedNav<
		strapiTypes.RetFromArgs<typeDescr.Navigation,RenderArgs>,
		RelatedArgsFromArgs<Args, Related>
	>[]
};

type RelatedArgsFromArgs<Args, Related> =
	Args extends {
		populateRelated: any
	}
	? Related
	: never
;

type NavToRenderedNav<Nav,Related> = {
	[Key in keyof Nav]:
		Key extends "items"
		? ItemWithChildren<Related>[]
		: Nav[Key]
};

const populateRender = {
	populate: {
		items: {
			populate: {
				subItems: true,
			}
		}
	}
} as const;

type RenderArgs = typeof populateRender;
type RenderItemArgs = RenderArgs["populate"]["items"];

type ItemWithChildren<Related> = PopulateSubItemsRec<
	AddRelated<
		strapiTypes.RetFromArgs<
			typeDescr.ItemRendered,
			RenderItemArgs
		>,
		Related
	>,
	Related
>;

type AddRelated<Ret,Related> =
	[Related] extends [never]
		? Ret
	: Ret & {
		related: Related|null
	}
;

type PopulateSubItemsRec<Item, RelatedArgs> = {
	[Key in keyof Item]:
		Key extends "subItems"
		? ItemWithChildren<RelatedArgs>[]
		: Item[Key]
};
