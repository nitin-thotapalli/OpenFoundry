import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const authProxy = process.env.OPENFOUNDRY_AUTH_PROXY;

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'import.meta.env.OPENFOUNDRY_DEMO': JSON.stringify(process.env.CODESPACES === 'true'),
	},
	server: {
		proxy: authProxy
			? {
					'^/api/v1/(auth|users|roles|permissions|groups|policies|api-keys)(/|$)': authProxy,
				}
			: undefined,
	},
});
