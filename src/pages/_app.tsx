import type { AppProps } from "next/app";
import {
  background,
  ChakraProvider,
  color,
  filter,
  Select,
  ColorModeScript,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const styles = {
  global: {
    body: {
      color: "gray.100",
    },
    a: {
      color: "#FFF",
    },
  },
};

const colors = {
  barber: {
    900: "#12131b",
    400: "#1b1c29",
    100: "#c6c6c6",
  },
  button: {
    cta: "#fba931",
    default: "#FFF",
    gray: "#DFDFDF",
    danger: "#FF4040",
  },
  orange: {
    900: "#fba931",
  },
};

const customTime = {
  field: {
    background: "#1b1c29",
    "::-webkit-calendar-picker-indicator": {
      filter:
        "invert(40%) sepia(87%) saturate(2960%) hue-rotate(200deg) brightness(95%) contrast(101%)",
    },
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config, styles, colors, customTime });

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
