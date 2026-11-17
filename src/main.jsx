import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hide the hopping-frog loader from index.html once the page and fonts are ready
// (shown for at least 1.4s so the hop reads, and never longer than 6s).
const loader = document.getElementById('app-loader')
if (loader) {
  const started = performance.now()
  let done = false
  const hide = () => {
    if (done) return
    done = true
    loader.classList.add('is-hidden')
    setTimeout(() => loader.remove(), 700)
  }
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', resolve, { once: true })
  })
  Promise.all([pageLoaded, document.fonts ? document.fonts.ready : Promise.resolve()]).then(() => {
    setTimeout(hide, Math.max(0, 1400 - (performance.now() - started)))
  })
  setTimeout(hide, 6000)
}
