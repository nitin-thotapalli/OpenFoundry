import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const authProxy = process.env.OPENFOUNDRY_AUTH_PROXY;

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: authProxy
			? {
					'^/api/v1/(auth|users|roles|permissions|groups|policies|api-keys)(/|$)': authProxy,
				}
			: undefined,
	},
});
