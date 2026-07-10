<script lang="ts">
	import { theme } from '$lib/stores';
	import { ChevronLeft } from '@lucide/svelte';
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center space-y-4 text-center"
>
	<div class="text-6xl">404</div>
	<h1 class="text-3xl font-bold">Page Not Found</h1>
	<p class={`text-lg ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
		The page you're looking for doesn't exist.
	</p>
	<a href="/" class="inline-flex items-center gap-2 text-blue-500 hover:underline mt-4">
		<ChevronLeft size={20} /> Back to Home
	</a>
</div>
