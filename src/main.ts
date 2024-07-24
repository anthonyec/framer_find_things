import './reset.css'
import './framer.css'

import App from './app.svelte'
import { framer } from "framer-plugin"

void framer.showUI({
  title: "Find Things",
  position: "top right",
  width: 320,
  height: 420,
  resizable: true
})

const app = new App({
  target: document.getElementById('app')!,
})

export default app
