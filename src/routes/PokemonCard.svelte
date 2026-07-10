<script lang="ts">
	import { Heart } from '@lucide/svelte';
	import { theme, favorites } from '$lib/stores';
	import type { Pokemon } from '$lib/api/schemas';

	interface Props {
		pokemon: Pokemon;
		isFavorite: boolean;
	}

	let { pokemon, isFavorite }: Props = $props();

	const typeColors: Record<string, string> = {
		fire: '#F08030', water: '#6890F0', grass: '#78C850',
		electric: '#F8D030', ice: '#98D8D8', fighting: '#A04038',
		poison: '#A040A0', ground: '#E0C068', flying: '#A890F0',
		psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
		ghost: '#705898', dragon: '#7038F8', dark: '#705848',
		steel: '#B8B8D0', fairy: '#EE99AC', normal: '#A8A878'
	};
</script>

<a
	href="/pokemon/{pokemon.name}"
	class={`group rounded-lg p-4 transition-all duration-200 hover:scale-105 ${
		$theme === 'dark'
			? 'bg-slate-700 hover:bg-slate-600'
			: 'bg-white hover:bg-slate-50 border border-slate-200'
	}`}
>
	<div class="relative mb-2 flex items-start justify-between">
		<span class={`text-sm font-semibold ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
			#{pokemon.id.toString().padStart(3, '0')}
		</span>
		<button
			onclick={(e) => {
				e.preventDefault();
				favorites.toggle(pokemon.id);
			}}
			class={`rounded transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400'}`}
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
		>
			<Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
		</button>
	</div>

	<div class="mb-3 flex h-32 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 rounded">
		{#if pokemon.sprites.front_default}
			<img
				src={pokemon.sprites.front_default}
				alt={pokemon.name}
				class="h-28 w-28 object-contain"
			/>
		{:else}
			<span class={$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>No image</span>
		{/if}
	</div>

	<h3 class="mb-2 font-semibold capitalize">{pokemon.name}</h3>

	<div class="flex flex-wrap gap-1">
		{#each pokemon.types as type}
			<span
				class="inline-flex rounded px-2 py-1 text-xs font-semibold text-white"
				style={`background-color: ${typeColors[type.type.name]}`}
			>
				{type.type.name}
			</span>
		{/each}
	</div>
</a>
