import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import Footer from './components/Footer'
import { Provider } from 'react-redux'
import { store } from './state/store'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Footer />
  </React.StrictMode>
)
reportWebVitals()
