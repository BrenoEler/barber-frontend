import type { AppProps } from "next/app";
import {
  ChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react";

import theme from "../theme";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
