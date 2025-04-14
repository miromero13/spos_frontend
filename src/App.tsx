import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { AuthProvider } from './context/authContext'
import { store } from './redux/store'
import Routes from './routes'
import { ThemeProvider } from './context/themeContext'
// import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  // 291724056968-k5rlgcpdifrukmb7asu2loc10440or1b.apps.googleusercontent.com
  return (
    <Provider store={store}> {/* para las acciones y el estado */}
      {/* <GoogleOAuthProvider clientId="291724056968-k5rlgcpdifrukmb7asu2loc10440or1b.apps.googleusercontent.com"> */}
        <AuthProvider>
          <ThemeProvider>
            <SWRConfig value={{ revalidateOnFocus: false }}> {/* para las peticiones de la api */}
              <BrowserRouter> {/* para las rutas */}
                <Routes /> {/* rutas */}
              </BrowserRouter>
            </SWRConfig>
          </ThemeProvider>
        </AuthProvider>
      {/* </GoogleOAuthProvider> */}
    </Provider>
  )
}

export default App
