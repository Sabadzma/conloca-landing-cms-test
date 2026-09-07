import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from '@/App'
import '@/index.css'

const container = document.getElementById('root')
if (container) {
  const app = <StrictMode><App /></StrictMode>
  if (container.children.length > 0) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
}

// @hyperide-managed
if (typeof location !== "undefined" && new URLSearchParams(location.search).get("component") && location.pathname.includes("test-preview")) { import("./__canvas_preview__").then(function(m){const C=m.default;if(C){Promise.all([import("react"),import("react-dom/client")]).then(function(mods){const orig=document.getElementById("root");let el;if(orig&&orig.parentNode){const fr=orig.cloneNode(false);if(!(fr instanceof HTMLElement))return;orig.parentNode.replaceChild(fr,orig);el=fr;}else{el=document.body;}mods[1].createRoot(el).render(mods[0].createElement(C));});}}); }
