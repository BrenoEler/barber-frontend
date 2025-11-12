import type { AppProps } from "next/app";
import "../styles/toast.scss";
import { ChakraProvider, theme, Toast } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === "dark" ? "barber.900" : "gray.100",
      color: props.colorMode === "dark" ? "gray.100" : "gray.800",
    },
    a: {
      color: props.colorMode === "dark" ? "#FFF" : "#000",
    },
  }),
};

const colors = {
  barber: {
    900: "#12131b",
    400: "#1b1c29",
    100: "#c6c6c6",
  },
  button: {
    cta: "#fba931",
    default: "#fff",
    gray: "#DFDFDF",
    danger: "#ff4040",
  },
  orange: {
    900: "#fba931",
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const themes = extendTheme({ colors, styles });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={themes}>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster
            // richColors
            position="top-center"
            // toastOptions={{
            //   style: {
            //     background: "#1e293b",
            //     color: "#fff",
            //     border: "1px solid #334155",
            //   },
            //   className: "meu-toast",
            // }}
          ></Toaster>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
