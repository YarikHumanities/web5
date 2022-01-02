import App from "./App.svelte";
import dotenv from 'dotenv';
dotenv.config();

const app = new App({
  target: document.body,
});

export default app;
