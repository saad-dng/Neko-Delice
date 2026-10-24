import { ViteReactSSG } from 'vite-react-ssg'
import type { RouteRecord } from 'vite-react-ssg'
import App from './App.tsx'
import './index.css'

const routes: RouteRecord[] = [
  {
    path: '/',
    element: <App />,
  },
]

export const createRoot = ViteReactSSG({ routes })
