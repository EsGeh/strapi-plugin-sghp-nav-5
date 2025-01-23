
export type RetFromArgs<
	Schema,
	Args
> = 
	Pick<
		SchemaAttributes<Schema>,
		FieldsFromArgs<SchemaAttributes<Schema>,Args>
	>
	& 
	RelationsFromArgs<Schema,Args>
;

type SchemaAttributes<Schema> =
  Schema extends { attributes: infer Attributes }
	? Attributes
  : never
;

type SchemaRelations<Schema> =
  Schema extends { relations: infer Relations }
	? Relations
  : never
;

type FieldsFromArgs<
  Attributes,
  RestArgs,
> =
  RestArgs extends { fields: readonly (infer Fields)[] }
  ? Extract<Fields, keyof Attributes>
  : keyof Attributes
;

type EmptyQuery = Record<string,never>;

type RelationsFromArgs<
	Schema,
  RestArgs,
> =
	RestArgs extends
		{ populate: readonly (infer Field)[] }
			| { populate: (infer Field) & string }
		? {
			[Key in (Field & keyof SchemaRelations<Schema>)]:
				Lookup<SchemaRelations<Schema>,Key> extends (infer SubSchema)[]
					? RetFromArgs<SubSchema,EmptyQuery>[]
				: Lookup<SchemaRelations<Schema>,Key> extends (infer SubSchema)
					? RetFromArgs<SubSchema,EmptyQuery>
				: never
		}
	: RestArgs extends { populate: (infer Dict) }
		? {
			[Key in (keyof Dict & keyof SchemaRelations<Schema>)]:
				// infer SubArgs:
				Dict[Key] extends infer SubArgs
				? (
					Lookup<SchemaRelations<Schema>,Key> extends (infer SubSchema)[]
						? RetFromArgs<SubSchema,SubArgs>[]
					: Lookup<SchemaRelations<Schema>,Key> extends (infer SubSchema)
						? RetFromArgs<SubSchema,SubArgs>
					: never
				) : never
		}
	: { [Key in never]: SchemaRelations<Schema>[Key] }
;

type Lookup<Dict,Key> =
	Key extends keyof Dict
	? Dict[Key]
	: never
;

