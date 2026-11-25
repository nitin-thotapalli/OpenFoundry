import { writable } from 'svelte/store';

export const demoEnabled = import.meta.env.DEV && import.meta.env.OPENFOUNDRY_DEMO === true;
export const demoActive = writable(false);
const sessionKey = 'openfoundry-demo-preview';

export function restoreDemo() {
  demoActive.set(demoEnabled && sessionStorage.getItem(sessionKey) === 'active');
}

export function signInDemo(email: string, password: string) {
  if (!demoEnabled || email.trim() !== '123@gmail.com' || password !== '12345') return false;

  sessionStorage.setItem(sessionKey, 'active');
  demoActive.set(true);
  return true;
}

export function exitDemo() {
  sessionStorage.removeItem(sessionKey);
  demoActive.set(false);
}
