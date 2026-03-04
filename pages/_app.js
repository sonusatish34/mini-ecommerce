
import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import Navbar from '../components/Navbar'
import { Montserrat } from 'next/font/google'
const montserrat = Montserrat({ subsets: ['latin'] })
export default function App({ Component, pageProps }) {
  return (
    <Provider className={montserrat.className} store={store}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  )
}
