import * as typeDescr from "./typeDescriptions";
import * as utils from "./utils";


export type RestReturnNavigations<Args> =
	utils.RetFromArgs<
		typeDescr.Navigation,
		Args
	>;

export type RestReturnItems<Args> =
	utils.RetFromArgs<
		typeDescr.Item,
		Args
	>;
