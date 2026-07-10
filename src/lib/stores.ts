import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme store
function createThemeStore() {
	const stored = browser ? localStorage.getItem('theme') : null;
	const initial = (stored as 'light' | 'dark' | null) || 'light';
	const { subscribe, set } = writable<'light' | 'dark'>(initial);

	return {
		subscribe,
		set: (value: 'light' | 'dark') => {
			if (browser) localStorage.setItem('theme', value);
			set(value);
		},
		toggle: () => {
			const current = stored === 'dark' ? 'light' : 'dark';
			if (browser) localStorage.setItem('theme', current);
			set(current);
		}
	};
}

// Favorites store
function createFavoritesStore() {
	const stored = browser ? localStorage.getItem('favorites') : null;
	const initial = stored ? JSON.parse(stored) : [];
	const { subscribe, set, update } = writable<number[]>(initial);

	return {
		subscribe,
		add: (id: number) => {
			update((fav) => {
				const newFav = [...fav, id];
				if (browser) localStorage.setItem('favorites', JSON.stringify(newFav));
				return newFav;
			});
		},
		remove: (id: number) => {
			update((fav) => {
				const newFav = fav.filter((f) => f !== id);
				if (browser) localStorage.setItem('favorites', JSON.stringify(newFav));
				return newFav;
			});
		},
		toggle: (id: number) => {
			update((fav) => {
				const newFav = fav.includes(id) ? fav.filter((f) => f !== id) : [...fav, id];
				if (browser) localStorage.setItem('favorites', JSON.stringify(newFav));
				return newFav;
			});
		}
	};
}

export const theme = createThemeStore();
export const favorites = createFavoritesStore();
