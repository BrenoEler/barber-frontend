import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

export function ExampleDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  return (
    <>
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        Abrir Drawer
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right" // pode ser: "top" | "right" | "bottom" | "left"
        onClose={onClose}
        finalFocusRef={btnRef} // foco volta pro botão
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Informações do Cliente</DrawerHeader>

          <DrawerBody>
            Aqui vai o conteúdo do seu Drawer — formulário, dados, etc.
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Salvar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
