<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemon } from '$lib/api/fetcher';
	import { favorites, theme } from '$lib/stores';
	import PokemonCard from '../PokemonCard.svelte';
	import type { Pokemon } from '$lib/api/schemas';

	let pokemons: Pokemon[] = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function loadFavorites() {
		loading = true;
		error = null;
		pokemons = [];

		try {
			const favIds = $favorites;
			const loaded = await Promise.all(
				favIds.map(id => getPokemon(id))
			);
			pokemons = loaded;
		} catch (e) {
			error = 'Failed to load favorites';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadFavorites();
	});

	$effect(() => {
		void $favorites; // Reactively respond to favorites changes
		loadFavorites();
	});
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold">My Favorites</h1>

	{#if error}
		<div class="rounded bg-red-100 p-4 text-red-800">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin">⏳</div>
			<p class="mt-2">Loading...</p>
		</div>
	{:else if pokemons.length === 0}
		<div class="text-center py-12">
			<p class={$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
				No favorite Pokémon yet. Add some from the Pokédex!
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each pokemons as pokemon (pokemon.id)}
				<PokemonCard {pokemon} isFavorite={true} />
			{/each}
		</div>
	{/if}
</div>
