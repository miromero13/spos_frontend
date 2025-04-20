import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { AuthProvider } from './context/authContext'
import { store } from './redux/store'
import Routes from './routes'
import { ThemeProvider } from './context/themeContext'

function App() {
  return (
    <Provider store={store}> {/* para las acciones y el estado */}
      <AuthProvider>
        <ThemeProvider>
          <SWRConfig value={{ revalidateOnFocus: false }}> {/* para las peticiones de la api */}
            <BrowserRouter> {/* para las rutas */}
              <Routes /> {/* rutas */}
            </BrowserRouter>
          </SWRConfig>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
