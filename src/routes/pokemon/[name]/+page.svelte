<script lang="ts">
	import { getPokemon, getPokemonSpecies, getEvolutionChain } from '$lib/api/fetcher';
	import { theme, favorites } from '$lib/stores';
	import { Heart, ChevronLeft, Volume2 } from '@lucide/svelte';
	import type { Pokemon, PokemonSpecies, EvolutionChain } from '$lib/api/schemas';

	interface PageData {
		pokemon: Pokemon;
		species: PokemonSpecies;
		evolutionChain: EvolutionChain;
	}

	let data: PageData | null = $state(null);
	let error = $state<string | null>(null);
	let spriteVariant = $state<'front_default' | 'back_default' | 'front_shiny' | 'back_shiny'>('front_default');
	let isFavorite = $state(false);

	const typeColors: Record<string, string> = {
		fire: '#F08030', water: '#6890F0', grass: '#78C850',
		electric: '#F8D030', ice: '#98D8D8', fighting: '#A04038',
		poison: '#A040A0', ground: '#E0C068', flying: '#A890F0',
		psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
		ghost: '#705898', dragon: '#7038F8', dark: '#705848',
		steel: '#B8B8D0', fairy: '#EE99AC', normal: '#A8A878'
	};

	const statNames: Record<string, string> = {
		hp: 'HP',
		attack: 'ATK',
		defense: 'DEF',
		'special-attack': 'SP.A',
		'special-defense': 'SP.D',
		speed: 'SPD'
	};

	async function loadData(name: string) {
		try {
			const pokemon = await getPokemon(name);
			const species = await getPokemonSpecies(name);
			const chainId = parseInt(species.evolution_chain.url.split('/').slice(-2, -1)[0]);
			const evolutionData = await getEvolutionChain(chainId);

			data = {
				pokemon,
				species,
				evolutionChain: evolutionData.chain
			};

			isFavorite = $favorites.includes(pokemon.id);
		} catch (e) {
			error = 'Failed to load Pokémon details';
			console.error(e);
		}
	}

	function getEvolutions(chain: EvolutionChain): string[] {
		const evolutions: string[] = [chain.species.name];
		for (const evolution of chain.evolves_to) {
			evolutions.push(...getEvolutions(evolution));
		}
		return evolutions;
	}

	function playCry(pokemon: Pokemon) {
		const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`;
		const audio = new Audio(cryUrl);
		audio.play();
	}

	$effect(() => {
		const parts = window.location.pathname.split('/');
		const name = parts[2];
		if (name) loadData(name);
	});
</script>

<div class="space-y-6">
	{#if error}
		<div class="rounded bg-red-100 p-4 text-red-800">
			{error}
		</div>
		<a href="/" class="inline-flex items-center gap-2 text-blue-500 hover:underline">
			<ChevronLeft size={20} /> Back to Pokédex
		</a>
	{:else if data}
		<div>
			<a href="/" class="inline-flex items-center gap-2 text-blue-500 hover:underline">
				<ChevronLeft size={20} /> Back to Pokédex
			</a>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- Left: Image and sprite variants -->
			<div>
				<div
					class={`rounded-lg p-8 flex items-center justify-center aspect-square ${
						$theme === 'dark'
							? 'bg-gradient-to-br from-slate-700 to-slate-800'
							: 'bg-gradient-to-br from-slate-100 to-slate-200'
					}`}
				>
					{#if data.pokemon.sprites[spriteVariant]}
						<img
							src={data.pokemon.sprites[spriteVariant]}
							alt={data.pokemon.name}
							class="h-64 w-64 object-contain"
						/>
					{:else}
						<span class={$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
							Not available
						</span>
					{/if}
				</div>

				<div class="mt-4 flex gap-2">
					<button
						onclick={() => (spriteVariant = 'front_default')}
						class={`flex-1 rounded px-3 py-2 text-sm transition ${
							spriteVariant === 'front_default'
								? 'bg-blue-500 text-white'
								: $theme === 'dark'
									? 'bg-slate-700 hover:bg-slate-600'
									: 'bg-slate-200 hover:bg-slate-300'
						}`}
					>
						Front
					</button>
					<button
						onclick={() => (spriteVariant = 'back_default')}
						class={`flex-1 rounded px-3 py-2 text-sm transition ${
							spriteVariant === 'back_default'
								? 'bg-blue-500 text-white'
								: $theme === 'dark'
									? 'bg-slate-700 hover:bg-slate-600'
									: 'bg-slate-200 hover:bg-slate-300'
						}`}
					>
						Back
					</button>
					<button
						onclick={() => (spriteVariant = 'front_shiny')}
						class={`flex-1 rounded px-3 py-2 text-sm transition ${
							spriteVariant === 'front_shiny'
								? 'bg-yellow-500 text-white'
								: $theme === 'dark'
									? 'bg-slate-700 hover:bg-slate-600'
									: 'bg-slate-200 hover:bg-slate-300'
						}`}
					>
						Shiny
					</button>
				</div>

				<button
					onclick={() => playCry(data!.pokemon)}
					class="mt-4 w-full flex items-center justify-center gap-2 rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
				>
					<Volume2 size={20} /> Play Cry
				</button>
			</div>

			<!-- Right: Details -->
			<div class="space-y-6">
				<!-- Title and favorite -->
				<div>
					<div class="flex items-start justify-between gap-4">
						<div>
							<h1 class="text-4xl font-bold capitalize">{data.pokemon.name}</h1>
							<p class={`text-lg ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
								#{data.pokemon.id.toString().padStart(3, '0')}
							</p>
						</div>
						<button
							onclick={() => favorites.toggle(data!.pokemon.id)}
							class={`rounded-lg p-3 transition-colors ${
								isFavorite
									? 'bg-red-100 text-red-500 dark:bg-red-900'
									: $theme === 'dark'
										? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
										: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
							}`}
							aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
						>
							<Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
						</button>
					</div>

					<div class="mt-3 flex flex-wrap gap-2">
						{#each data.pokemon.types as type}
							<span
								class="inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white"
								style={`background-color: ${typeColors[type.type.name]}`}
							>
								{type.type.name}
							</span>
						{/each}
					</div>
				</div>

				<!-- Stats -->
				<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
					<h2 class="mb-4 text-xl font-bold">Base Stats</h2>
					{#each data.pokemon.stats as stat}
						<div class="mb-3">
							<div class="flex justify-between text-sm font-medium mb-1">
								<span>{statNames[stat.stat.name] || stat.stat.name}</span>
								<span>{stat.base_stat}</span>
							</div>
							<div
								class={`h-2 rounded-full overflow-hidden ${
									$theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
								}`}
							>
								<div
									class="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
									style={`width: ${(stat.base_stat / 255) * 100}%`}
								></div>
							</div>
						</div>
					{/each}
					<div class="mt-4 flex justify-between border-t border-slate-500 pt-2 font-bold">
						<span>Total</span>
						<span>
							{data.pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
						</span>
					</div>
				</div>

				<!-- Physical attributes -->
				<div class="grid grid-cols-2 gap-4">
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Height</p>
						<p class="text-xl font-bold">{(data.pokemon.height / 10).toFixed(1)}m</p>
					</div>
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Weight</p>
						<p class="text-xl font-bold">{(data.pokemon.weight / 10).toFixed(1)}kg</p>
					</div>
				</div>

				<!-- Abilities -->
				{#if data.pokemon.abilities.length > 0}
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<h2 class="mb-3 text-lg font-bold">Abilities</h2>
						<div class="space-y-2">
							{#each data.pokemon.abilities as ability}
								<div class="flex items-center justify-between">
									<span class="capitalize">{ability.ability.name}</span>
									{#if ability.is_hidden}
										<span class="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
											Hidden
										</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Evolution chain -->
		{#if data.evolutionChain}
			<div class={`rounded-lg p-6 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
				<h2 class="mb-4 text-xl font-bold">Evolution Chain</h2>
				<div class="flex flex-wrap gap-4">
					{#each getEvolutions(data.evolutionChain) as pokemon}
						<a
							href="/pokemon/{pokemon}"
							class={`rounded-lg p-4 text-center transition hover:scale-105 ${
								$theme === 'dark'
									? 'bg-slate-700 hover:bg-slate-600'
									: 'bg-white border border-slate-200'
							}`}
						>
							<div class="mb-2 capitalize font-semibold">{pokemon}</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<div class="text-center py-12">
			<div class="inline-block animate-spin">⏳</div>
			<p class="mt-2">Loading...</p>
		</div>
	{/if}
</div>
