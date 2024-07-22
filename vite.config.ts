import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import framer from 'vite-plugin-framer';

export default defineConfig({
	plugins: [sveltekit(), mkcert(), framer()],
	server: {
		https: true,
		// Fix for using mkcert with svelte-kit:
		// https://github.com/liuweiGL/vite-plugin-mkcert/issues/89#issuecomment-2152916450
		proxy: {}
	}
});
