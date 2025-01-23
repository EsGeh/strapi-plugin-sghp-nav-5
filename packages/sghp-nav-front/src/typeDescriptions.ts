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
		locale: string,
		parent: Item|null,
	}
	relations: {
		related: any,
		subItems: Item[],
	}
}

