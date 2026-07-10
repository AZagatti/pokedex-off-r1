<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemonList, getPokemon, getType, getGeneration } from '$lib/api/fetcher';
	import { theme, favorites } from '$lib/stores';
	import PokemonCard from './PokemonCard.svelte';
	import { Heart } from '@lucide/svelte';
	import type { Pokemon } from '$lib/api/schemas';

	let pokemons: Pokemon[] = $state([]);
	let filteredPokemons: Pokemon[] = $state([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let offset = $state(0);
	let hasMore = $state(true);

	let searchQuery = $state('');
	let selectedGenerations: number[] = $state([]);
	let selectedTypes: string[] = $state([]);
	let sortBy = $state<'dex' | 'stats'>('dex');

	let debounceTimer: number;

	const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const types = [
		'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
		'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
		'dragon', 'dark', 'steel', 'fairy'
	];

	const typeColors: Record<string, string> = {
		fire: '#F08030', water: '#6890F0', grass: '#78C850',
		electric: '#F8D030', ice: '#98D8D8', fighting: '#A04038',
		poison: '#A040A0', ground: '#E0C068', flying: '#A890F0',
		psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
		ghost: '#705898', dragon: '#7038F8', dark: '#705848',
		steel: '#B8B8D0', fairy: '#EE99AC', normal: '#A8A878'
	};

	async function loadPokemon() {
		if (loading || !hasMore) return;
		loading = true;
		error = null;

		try {
			const list = await getPokemonList(30, offset);
			hasMore = list.next !== null;

			const detailedPokemon = await Promise.all(
				list.results.map(p => getPokemon(p.name))
			);

			pokemons = [...pokemons, ...detailedPokemon];
			offset += 30;
			applyFilters();
		} catch (e) {
			error = 'Failed to load Pokémon';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function applyFilters() {
		let filtered = [...pokemons];

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter(p =>
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.id.toString() === searchQuery
			);
		}

		// Type filter
		if (selectedTypes.length > 0) {
			filtered = filtered.filter(p =>
				p.types.some(t => selectedTypes.includes(t.type.name))
			);
		}

		// Sort
		if (sortBy === 'stats') {
			filtered.sort((a, b) => {
				const statA = a.stats.reduce((sum, s) => sum + s.base_stat, 0);
				const statB = b.stats.reduce((sum, s) => sum + s.base_stat, 0);
				return statB - statA;
			});
		}

		filteredPokemons = filtered;
	}

	function handleSearch(query: string) {
		searchQuery = query;
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			applyFilters();
		}, 250);
	}

	function toggleGeneration(gen: number) {
		if (selectedGenerations.includes(gen)) {
			selectedGenerations = selectedGenerations.filter(g => g !== gen);
		} else {
			selectedGenerations = [...selectedGenerations, gen];
		}
		applyFilters();
	}

	function toggleType(type: string) {
		if (selectedTypes.includes(type)) {
			selectedTypes = selectedTypes.filter(t => t !== type);
		} else {
			selectedTypes = [...selectedTypes, type];
		}
		applyFilters();
	}

	function clearFilters() {
		searchQuery = '';
		selectedGenerations = [];
		selectedTypes = [];
		sortBy = 'dex';
		applyFilters();
	}

	onMount(() => {
		loadPokemon();
	});
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<h1 class="text-3xl font-bold">Pokédex</h1>

		<!-- Search bar -->
		<div>
			<input
				type="text"
				placeholder="Search by name or ID..."
				value={searchQuery}
				onchange={(e) => handleSearch(e.currentTarget.value)}
				class={`w-full rounded-lg border px-4 py-2 transition-colors ${
					$theme === 'dark'
						? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
						: 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'
				}`}
			/>
		</div>

		<!-- Filters -->
		<div class="space-y-4 rounded-lg p-4 {$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}">
			<!-- Sort -->
			<div>
				<label for="sort-select" class="block text-sm font-medium">Sort</label>
				<select
					id="sort-select"
					value={sortBy}
					onchange={(e) => {
						sortBy = e.currentTarget.value as 'dex' | 'stats';
						applyFilters();
					}}
					class={`mt-2 rounded border px-3 py-2 ${
						$theme === 'dark'
							? 'border-slate-600 bg-slate-700'
							: 'border-slate-300 bg-white'
					}`}
				>
					<option value="dex">Dex Number</option>
					<option value="stats">Base Stats Total</option>
				</select>
			</div>

			<!-- Types -->
			<fieldset>
				<legend class="block text-sm font-medium mb-2">Types</legend>
				<div class="grid grid-cols-3 gap-2 md:grid-cols-6">
					{#each types as type}
						<button
							onclick={() => toggleType(type)}
							class={`rounded px-3 py-2 text-sm capitalize transition-colors ${
								selectedTypes.includes(type)
									? 'text-white'
									: $theme === 'dark'
										? 'bg-slate-700 hover:bg-slate-600'
										: 'bg-slate-200 hover:bg-slate-300'
							}`}
							style={selectedTypes.includes(type) ? `background-color: ${typeColors[type]}` : ''}
						>
							{type}
						</button>
					{/each}
				</div>
			</fieldset>

			<!-- Clear filters -->
			{#if searchQuery || selectedGenerations.length > 0 || selectedTypes.length > 0}
				<button
					onclick={clearFilters}
					class="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
				>
					Clear Filters
				</button>
			{/if}
		</div>

		<!-- Empty state -->
		{#if filteredPokemons.length === 0 && !loading}
			<div class="text-center py-12">
				<p class={$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
					No Pokémon found matching your filters
				</p>
			</div>
		{/if}
	</div>

	<!-- Pokémon grid -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
		{#each filteredPokemons as pokemon (pokemon.id)}
			<PokemonCard {pokemon} isFavorite={$favorites.includes(pokemon.id)} />
		{/each}

		<!-- Skeleton loaders -->
		{#if loading}
			{#each { length: 6 } as _}
				<div
					class={`rounded-lg p-4 ${
						$theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
					} animate-pulse`}
				>
					<div class={`h-40 rounded ${$theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Load more button -->
	{#if hasMore && !loading}
		<div class="flex justify-center py-8">
			<button
				onclick={loadPokemon}
				class="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
			>
				Load More
			</button>
		</div>
	{/if}

	{#if error}
		<div class="rounded bg-red-100 p-4 text-red-800">
			{error}
		</div>
	{/if}
</div>
