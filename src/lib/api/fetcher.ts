import { z } from "zod";
import { getCached, setCached } from "./cache";
import * as schemas from "./schemas";

const API_BASE = "https://pokeapi.co/api/v2";

async function fetchWithCache<T>(url: string, schema: any): Promise<T> {
  const cached = getCached<T>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  const validated = schema.parse(data);
  setCached(url, validated);
  return validated;
}

export async function getPokemonList(
  limit: number = 30,
  offset: number = 0,
): Promise<schemas.PokemonList> {
  return fetchWithCache(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    schemas.PokemonListSchema,
  );
}

export async function getPokemon(nameOrId: string | number): Promise<schemas.Pokemon> {
  return fetchWithCache(`${API_BASE}/pokemon/${nameOrId}`, schemas.PokemonSchema);
}

export async function getPokemonSpecies(
  nameOrId: string | number,
): Promise<schemas.PokemonSpecies> {
  return fetchWithCache(`${API_BASE}/pokemon-species/${nameOrId}`, schemas.PokemonSpeciesSchema);
}

export async function getEvolutionChain(id: number): Promise<{ chain: schemas.EvolutionChain }> {
  return fetchWithCache(
    `${API_BASE}/evolution-chain/${id}`,
    z.object({ chain: schemas.EvolutionChainSchema }),
  );
}

export async function getGeneration(id: number): Promise<schemas.Generation> {
  return fetchWithCache(`${API_BASE}/generation/${id}`, schemas.GenerationSchema);
}

export async function getType(name: string): Promise<schemas.Type> {
  return fetchWithCache(`${API_BASE}/type/${name}`, schemas.TypeSchema);
}

export async function getBerryList(
  limit: number = 30,
  offset: number = 0,
): Promise<schemas.BerryList> {
  return fetchWithCache(
    `${API_BASE}/berry?limit=${limit}&offset=${offset}`,
    schemas.BerryListSchema,
  );
}

export async function getBerry(nameOrId: string | number): Promise<schemas.Berry> {
  return fetchWithCache(`${API_BASE}/berry/${nameOrId}`, schemas.BerrySchema);
}
