import { z } from 'zod';

export const PokemonSpriteSchema = z.object({
	front_default: z.string().nullable(),
	front_shiny: z.string().nullable(),
	back_default: z.string().nullable(),
	back_shiny: z.string().nullable()
});

export const PokemonAbilitySchema = z.object({
	ability: z.object({
		name: z.string(),
		url: z.string()
	}),
	is_hidden: z.boolean(),
	slot: z.number()
});

export const MoveSchema = z.object({
	move: z.object({
		name: z.string(),
		url: z.string()
	}),
	version_group_details: z.array(z.object({
		level_learned_at: z.number(),
		version_group: z.object({
			name: z.string()
		})
	}))
});

export const PokemonTypeSchema = z.object({
	slot: z.number(),
	type: z.object({
		name: z.string(),
		url: z.string()
	})
});

export const PokemonSchema = z.object({
	id: z.number(),
	name: z.string(),
	height: z.number(),
	weight: z.number(),
	sprites: PokemonSpriteSchema,
	types: z.array(PokemonTypeSchema),
	stats: z.array(
		z.object({
			base_stat: z.number(),
			effort: z.number(),
			stat: z.object({
				name: z.string(),
				url: z.string()
			})
		})
	),
	abilities: z.array(PokemonAbilitySchema),
	moves: z.array(MoveSchema)
});

export const PokemonListItemSchema = z.object({
	name: z.string(),
	url: z.string()
});

export const PokemonListSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(PokemonListItemSchema)
});

export const PokemonSpeciesSchema = z.object({
	id: z.number(),
	name: z.string(),
	evolution_chain: z.object({
		url: z.string()
	}),
	generation: z.object({
		name: z.string(),
		url: z.string()
	})
});

export const EvolutionChainSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.number(),
		is_baby: z.boolean(),
		species: z.object({
			name: z.string(),
			url: z.string()
		}),
		evolves_to: z.array(EvolutionChainSchema),
		evolution_details: z.array(z.unknown())
	})
);

export const GenerationSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon_species: z.array(PokemonListItemSchema)
});

export const TypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon: z.array(
		z.object({
			pokemon: z.object({
				name: z.string(),
				url: z.string()
			}),
			slot: z.number()
		})
	)
});

export const BerrySchema = z.object({
	id: z.number(),
	name: z.string(),
	firmness: z.object({
		name: z.string()
	}),
	flavors: z.array(
		z.object({
			flavor: z.object({
				name: z.string()
			}),
			potency: z.number()
		})
	),
	growth_time: z.number(),
	size: z.number()
});

export const BerryListSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(
		z.object({
			name: z.string(),
			url: z.string()
		})
	)
});

export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonListItem = z.infer<typeof PokemonListItemSchema>;
export type PokemonList = z.infer<typeof PokemonListSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Type = z.infer<typeof TypeSchema>;
export type Berry = z.infer<typeof BerrySchema>;
export type BerryList = z.infer<typeof BerryListSchema>;
