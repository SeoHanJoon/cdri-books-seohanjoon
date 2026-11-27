// 글자 범위별로 나뉜 가변 폰트(굵기 100~900). 화면에 나온 글자가 든 조각만 내려받는다.
import '@fontsource-variable/noto-sans-kr'
import '@/styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
