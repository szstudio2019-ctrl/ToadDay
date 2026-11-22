import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = createRoot(document.getElementById('root'))

if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
  const Admin = lazy(() => import('./admin/Admin.jsx'))
  root.render(
    <StrictMode>
      <Suspense fallback={null}><Admin /></Suspense>
    </StrictMode>,
  )
} else {
  Promise.all([import('./App.jsx'), import('./content/supabase.js').then((m) => m.loadContent())])
    .then(([{ default: App }, content]) => {
      root.render(
        <StrictMode>
          <App content={content} />
        </StrictMode>,
      )
    })
}
