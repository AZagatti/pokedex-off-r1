<script lang="ts">
	import { getBerry } from '$lib/api/fetcher';
	import { theme } from '$lib/stores';
	import { ChevronLeft } from '@lucide/svelte';
	import type { Berry } from '$lib/api/schemas';

	let berry: Berry | null = $state(null);
	let error = $state<string | null>(null);

	async function loadBerry(name: string) {
		try {
			berry = await getBerry(name);
		} catch (e) {
			error = 'Failed to load berry details';
			console.error(e);
		}
	}

	$effect(() => {
		const parts = window.location.pathname.split('/');
		const name = parts[2];
		if (name) loadBerry(name);
	});
</script>

<div class="space-y-6">
	{#if error}
		<div class="rounded bg-red-100 p-4 text-red-800">
			{error}
		</div>
		<a href="/berries" class="inline-flex items-center gap-2 text-blue-500 hover:underline">
			<ChevronLeft size={20} /> Back to Berries
		</a>
	{:else if berry}
		<div>
			<a href="/berries" class="inline-flex items-center gap-2 text-blue-500 hover:underline">
				<ChevronLeft size={20} /> Back to Berries
			</a>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<div
				class={`rounded-lg p-8 flex items-center justify-center h-80 ${
					$theme === 'dark'
						? 'bg-gradient-to-br from-slate-700 to-slate-800'
						: 'bg-gradient-to-br from-slate-100 to-slate-200'
				}`}
			>
				<div class="text-center">
					<div class="text-6xl mb-2">🫐</div>
					<p class="text-xl font-semibold capitalize">{berry.name}</p>
				</div>
			</div>

			<div class="space-y-6">
				<div>
					<h1 class="text-4xl font-bold capitalize">{berry.name}</h1>
					<p class={`text-lg ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
						Berry #{berry.id}
					</p>
				</div>

				<!-- Firmness -->
				{#if berry.firmness}
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
							Firmness
						</p>
						<p class="text-xl font-bold capitalize">{berry.firmness.name}</p>
					</div>
				{/if}

				<!-- Size and Growth Time -->
				<div class="grid grid-cols-2 gap-4">
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
							Size
						</p>
						<p class="text-xl font-bold">{berry.size}mm</p>
					</div>
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
							Growth Time
						</p>
						<p class="text-xl font-bold">{berry.growth_time}h</p>
					</div>
				</div>

				<!-- Flavors -->
				{#if berry.flavors.length > 0}
					<div class={`rounded-lg p-4 ${$theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
						<h2 class="mb-3 text-lg font-bold">Flavors</h2>
						<div class="space-y-2">
							{#each berry.flavors.sort((a, b) => b.potency - a.potency) as flavor}
								<div class="flex items-center justify-between">
									<span class="capitalize">{flavor.flavor.name}</span>
									<div
										class="h-2 w-24 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-600"
									>
										<div
											class="h-full bg-blue-500"
											style={`width: ${(flavor.potency / 100) * 100}%`}
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="inline-block animate-spin">⏳</div>
			<p class="mt-2">Loading...</p>
		</div>
	{/if}
</div>
