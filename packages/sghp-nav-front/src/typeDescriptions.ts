export type Navigation = {
	attributes: {
		name: string,
		locale: string
	},
	relations: {
		items: Item[],
	}
}

export type Item = {
	attributes: {
		title: string,
		path: string,
		order: number,
		parent: Item|null,
	}
	relations: {
		related: any,
	}
}


/*************
 * rendered:
**************/

export type ItemRendered = {
	attributes: {
		title: string,
		path: string,
	}
	relations: {
		related: Related,
		subItems: ItemRendered[],
	}
};

type Related = {
	attributes: {
		id: number,
		documentId: string,
	}
}
