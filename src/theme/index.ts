import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";

const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === "dark" ? "barber.900" : "gray.100",
      color: props.colorMode === "dark" ? "gray.100" : "black", 
    },
    a: {
      color: props.colorMode === "dark" ? "#FFF" : "black",
    },
  }),
};

const components = {
  Input: {
    variants: {
      filled: (props: any) => ({
        field: {
          bg: props.colorMode === "dark" ? "barber.400" : "gray.200",
          _focus: {
            bg: props.colorMode === "dark" ? "barber.400" : "white",
          },
          "::-webkit-calendar-picker-indicator": {
            filter:
              "invert(40%) sepia(87%) saturate(2960%) hue-rotate(200deg) brightness(95%) contrast(101%)",
          },
        },
      }),
    },
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
});

export default theme;
