import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { configureDependencyManager } from './app_starter'
import App from './App'
import './index.css'
import { DepManagerContext } from './core/contexts/DepManager.Context'

const depManager = configureDependencyManager()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <DepManagerContext.Provider value={depManager}>
    <App />
  </DepManagerContext.Provider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
