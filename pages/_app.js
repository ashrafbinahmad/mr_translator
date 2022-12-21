// pages/_app.js
import '../styles/globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import chakraui from '../helpers/chakraui'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider
    theme={chakraui}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp