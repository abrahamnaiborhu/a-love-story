import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import '@fontsource/nothing-you-could-do/latin-400.css'
import '@fontsource/bodoni-moda/latin-500-italic.css'
import '@fontsource/inter/latin-400.css'
import './index.css'
import App from './App.tsx'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin)
// Phone browser bars sliding in and out mustn't make ScrollTrigger re-measure mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
