<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores';
	import { Moon, Sun } from '@lucide/svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content={$theme === 'dark' ? '#0f172a' : '#ffffff'} />
</svelte:head>

<div
	class={`min-h-screen transition-colors duration-300 ${
		$theme === 'dark'
			? 'bg-slate-900 text-white'
			: 'bg-white text-slate-900'
	}`}
>
	<nav
		class={`sticky top-0 z-50 border-b transition-colors ${
			$theme === 'dark'
				? 'border-slate-700 bg-slate-800'
				: 'border-slate-200 bg-white'
		}`}
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a href="/" class="text-2xl font-bold text-red-500">
						Pokédex
					</a>
					<div class="hidden gap-6 md:flex">
						<a
							href="/"
							class={`transition-colors ${
								$theme === 'dark'
									? 'hover:text-slate-300'
									: 'hover:text-slate-700'
							}`}
						>
							Pokédex
						</a>
						<a
							href="/berries"
							class={`transition-colors ${
								$theme === 'dark'
									? 'hover:text-slate-300'
									: 'hover:text-slate-700'
							}`}
						>
							Berries
						</a>
						<a
							href="/favorites"
							class={`transition-colors ${
								$theme === 'dark'
									? 'hover:text-slate-300'
									: 'hover:text-slate-700'
							}`}
						>
							Favorites
						</a>
					</div>
				</div>

				<button
					onclick={() => theme.toggle()}
					class={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
						$theme === 'dark'
							? 'bg-slate-700 hover:bg-slate-600'
							: 'bg-slate-100 hover:bg-slate-200'
					}`}
					aria-label="Toggle theme"
					title={$theme === 'dark' ? 'Light mode' : 'Dark mode'}
				>
					{#if $theme === 'dark'}
						<Sun size={20} />
					{:else}
						<Moon size={20} />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(input, button, select, textarea) {
		font-family: inherit;
	}

	:global([data-sveltekit-preload-data='tap']) {
		cursor: pointer;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
