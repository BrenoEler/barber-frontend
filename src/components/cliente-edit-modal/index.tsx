import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiSave, FiUser, FiX } from 'react-icons/fi';

export interface Cliente {
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
  onSave?: (data: Cliente | (Omit<Cliente, 'id'> & { id?: number })) => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  cliente,
  onSave,
}: CreateUserModalProps) {
  const [name, setName] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    if (cliente) {
      setName(cliente.name);
      setCelular(cliente.celular);
      setEmail(cliente.email);
      setEndereco(cliente.endereco);
    } else {
      setName('');
      setCelular('');
      setEmail('');
      setEndereco('');
    }
  }, [cliente, isOpen]);

  const handleSave = () => {
    if (!onSave) {
      onClose();
      return;
    }

    const data = {
      id: cliente?.id,
      name,
      celular,
      email,
      endereco,
    };

    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        bg="barber.400"
        borderRadius="xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FiUser} color="button.cta" boxSize={6} />
            <Text color="whiteAlpha.900" fontSize="xl" fontWeight="bold">
              {cliente ? 'Editar Cliente' : 'Cadastrar Cliente'}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.700" _hover={{ color: 'white' }} />

        <Divider borderColor="whiteAlpha.200" />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel
                color="whiteAlpha.700"
                fontSize="sm"
                fontWeight="medium"
              >
                Nome Completo *
              </FormLabel>
              <Input
                placeholder="Digite o nome completo"
                size="lg"
                bg="barber.900"
                color="whiteAlpha.900"
                borderColor="whiteAlpha.200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                _hover={{ borderColor: 'button.cta' }}
                _focus={{
                  borderColor: 'button.cta',
                  boxShadow: '0 0 0 1px button.cta',
                }}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel
                  color="whiteAlpha.700"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Celular *
                </FormLabel>
                <Input
                  placeholder="(27) 99999-9999"
                  size="lg"
                  bg="barber.900"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.200"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  _hover={{ borderColor: 'button.cta' }}
                  _focus={{
                    borderColor: 'button.cta',
                    boxShadow: '0 0 0 1px button.cta',
                  }}
                />
              </FormControl>

              <FormControl flex={1}>
                <FormLabel
                  color="whiteAlpha.700"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  E-mail
                </FormLabel>
                <Input
                  placeholder="cliente@email.com"
                  type="email"
                  size="lg"
                  bg="barber.900"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  _hover={{ borderColor: 'button.cta' }}
                  _focus={{
                    borderColor: 'button.cta',
                    boxShadow: '0 0 0 1px button.cta',
                  }}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel
                color="whiteAlpha.700"
                fontSize="sm"
                fontWeight="medium"
              >
                Endereço
              </FormLabel>
              <Input
                placeholder="Rua, número, bairro..."
                size="lg"
                bg="barber.900"
                color="whiteAlpha.900"
                borderColor="whiteAlpha.200"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                _hover={{ borderColor: 'button.cta' }}
                _focus={{
                  borderColor: 'button.cta',
                  boxShadow: '0 0 0 1px button.cta',
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <Divider borderColor="whiteAlpha.200" />

        <ModalFooter>
          <HStack spacing={3} w="100%">
            <Button
              variant="outline"
              flex={1}
              leftIcon={<Icon as={FiX} />}
              borderColor="red.400"
              color="red.400"
              _hover={{
                bg: 'red.50',
                borderColor: 'red.500',
                color: 'red.500',
              }}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={FiSave} />}
              bgGradient="linear(to-r, button.cta, #FFb13e)"
              color="gray.900"
              _hover={{
                bgGradient: 'linear(to-r, #FFb13e, button.cta)',
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              onClick={handleSave}
              fontWeight="bold"
              transition="all 0.2s"
            >
              Salvar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
