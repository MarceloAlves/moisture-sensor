import React from 'react'
import ReactDOM from 'react-dom'
import { CSSReset, ThemeProvider, theme } from '@chakra-ui/core'
import App from './App'
import { customIcons } from './icons'

const myTheme = {
  ...theme,
  icons: {
    ...theme.icons,
    ...customIcons,
  },
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={myTheme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('app')
)
