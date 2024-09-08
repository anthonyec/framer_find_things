import './reset.css'
import './framer.css'

import App from './app.svelte'
import { framer } from "framer-plugin"
import { mount } from 'svelte'

// Expose framer on the global scope for testing.
;(window as any).framer = framer

void framer.showUI({
  title: "Find Replace",
  position: "top left",
  width: 300,
  height: 450,
  resizable: false
})

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
