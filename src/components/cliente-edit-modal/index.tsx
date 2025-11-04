import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
interface Cliente {
  id: number;
  name: string;
  celular: string;
  email: string;
  endereco: string;
}
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente | null;
}

export function CreateUserModal({
  isOpen,
  onClose,
  cliente,
}: CreateUserModalProps) {
  if (!cliente) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="barber.400">
        <ModalHeader>Cadastar Cliente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Nome" mb={3} value={cliente.name} />
          <Input placeholder="Celular" mb={3} value={cliente.celular} />
          <Input placeholder="Email" mb={3} value={cliente.email} />
          <Input placeholder="Endereço" mb={3} value={cliente.endereco} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            border={"1px solid red"}
            color="red"
            _hover="barber.400"
          >
            Cancelar
          </Button>
          <Button colorScheme="blue">Salvar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
