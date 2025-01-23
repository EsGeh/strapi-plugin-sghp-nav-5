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
