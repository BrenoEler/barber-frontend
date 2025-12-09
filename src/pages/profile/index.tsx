import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Badge,
  useColorModeValue,
  useMediaQuery,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useContext, useState } from 'react';
import { Sidebar } from '../../components/sidebar';

import Link from 'next/link';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTelegram } from 'react-icons/fa';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiCrown,
  FiEdit3,
  FiLogOut,
  FiSave,
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { toast } from 'sonner';

interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
}

interface ProfileProps {
  user: UserProps;
  premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(
    user?.endereco ? user?.endereco : '',
  );
  const [checked, setChecked] = useState('');

  const cardBg = useColorModeValue('barber.400', 'gray.800');
  const borderColor = useColorModeValue('whiteAlpha.300', 'gray.600');

  function joinTelegram() {
    window.open('https://t.me/barber_appointmentsBot', '_blank');
  }

  function myCheckBox() {
    if (checked === 'enabled') {
      setChecked('disabled');
    } else {
      setChecked('enabled');
    }
  }

  async function handleLogout() {
    await logoutUser();
  }

  async function handleUpdateUser() {
    if (name === '') {
      toast.error('O nome da empresa é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const apiClient = setupAPIClient();
      await apiClient.put('/users', {
        name: name,
        endereco: endereco,
      });

      toast.success('Dados alterados com sucesso!');
    } catch (err) {
      console.log(err);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta - BarberPRO</title>
      </Head>
      <Sidebar>
        <Flex direction="column" w="100%" p={isMobile ? 2 : 6}>
          {/* Cabeçalho */}
          <Heading
            fontSize={isMobile ? '28px' : '3xl'}
            color="whiteAlpha.900"
            mb={6}
          >
            Minha Conta
          </Heading>

          <Divider borderColor={borderColor} mb={6} />

          {/* Card de Informações do Usuário */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            mb={6}
            border="1px solid"
            borderColor={borderColor}
            shadow="md"
          >
            <VStack spacing={6} align="stretch">
              <HStack spacing={3} mb={2}>
                <Icon as={FiUser} boxSize={6} color="orange.300" />
                <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900">
                  Informações da Empresa
                </Text>
              </HStack>

              <Divider borderColor={borderColor} />

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  color="whiteAlpha.700"
                  fontWeight="medium"
                  mb={2}
                >
                  Nome da Empresa
                </FormLabel>
                <Input
                  bg="barber.900"
                  borderColor={borderColor}
                  color="whiteAlpha.900"
                  placeholder="Nome da sua barbearia"
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  _hover={{ borderColor: 'orange.400' }}
                  _focus={{ borderColor: 'orange.400' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  color="whiteAlpha.700"
                  fontWeight="medium"
                  mb={2}
                >
                  Email
                </FormLabel>
                <Input
                  bg="barber.900"
                  borderColor={borderColor}
                  color="whiteAlpha.600"
                  value={user?.email}
                  size="lg"
                  isReadOnly
                  _hover={{ borderColor: borderColor }}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  color="whiteAlpha.700"
                  fontWeight="medium"
                  mb={2}
                >
                  Endereço
                </FormLabel>
                <Input
                  bg="barber.900"
                  borderColor={borderColor}
                  color="whiteAlpha.900"
                  placeholder="Endereço da barbearia"
                  size="lg"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  _hover={{ borderColor: 'orange.400' }}
                  _focus={{ borderColor: 'orange.400' }}
                />
              </FormControl>
            </VStack>
          </Box>

          {/* Card de Plano */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            mb={6}
            border="1px solid"
            borderColor={borderColor}
            shadow="md"
          >
            <Flex
              direction={isMobile ? 'column' : 'row'}
              align={isMobile ? 'flex-start' : 'center'}
              justify="space-between"
              gap={4}
            >
              <HStack spacing={3}>
                <Icon as={FiCrown} boxSize={6} color="orange.300" />
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900">
                    Plano Atual
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Badge
                      bg={premium ? 'orange.400' : 'green.400'}
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      {premium ? 'Premium' : 'Grátis'}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              <Link href="/planos" prefetch={true}>
                <Button
                  leftIcon={<Icon as={FiEdit3} />}
                  variant="outline"
                  borderColor={borderColor}
                  color="whiteAlpha.900"
                  _hover={{ bg: 'whiteAlpha.200', borderColor: 'orange.400' }}
                >
                  Mudar Plano
                </Button>
              </Link>
            </Flex>
          </Box>

          {/* Card Premium - Solicita Agendamentos */}
          {premium && (
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              mb={6}
              border="1px solid"
              borderColor={borderColor}
              shadow="md"
            >
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaTelegram} boxSize={6} color="blue.400" />
                  <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900">
                    Solicita Agendamentos
                  </Text>
                </HStack>

                <Divider borderColor={borderColor} />

                <Checkbox
                  size="lg"
                  colorScheme="blue"
                  isChecked={checked === 'enabled'}
                  onChange={myCheckBox}
                  color="whiteAlpha.900"
                >
                  <Text color="whiteAlpha.900">
                    Ativar recebimento de agendamentos via Telegram
                  </Text>
                </Checkbox>

                {checked === 'enabled' && (
                  <Button
                    leftIcon={<FaTelegram size={20} />}
                    bg="blue.500"
                    color="white"
                    size="lg"
                    _hover={{ bg: 'blue.600' }}
                    onClick={joinTelegram}
                  >
                    Conectar com Telegram Bot
                  </Button>
                )}

                <Divider borderColor={borderColor} />

                <Flex
                  direction={isMobile ? 'column' : 'row'}
                  align={isMobile ? 'flex-start' : 'center'}
                  justify="space-between"
                  gap={4}
                  p={4}
                  bg="barber.900"
                  borderRadius="md"
                >
                  <HStack spacing={3}>
                    <Icon as={FiEdit3} boxSize={5} color="orange.300" />
                    <Text fontWeight="medium" color="whiteAlpha.900">
                      Editar Landing Page
                    </Text>
                  </HStack>

                  <Link href="/editlandingpage" prefetch={true}>
                    <Button
                      leftIcon={<BsPencilSquare />}
                      size="sm"
                      bg="green.500"
                      color="white"
                      _hover={{ bg: 'green.600' }}
                    >
                      Editar
                    </Button>
                  </Link>
                </Flex>
              </VStack>
            </Box>
          )}

          {/* Botões de Ação */}
          <VStack spacing={4} align="stretch">
            <Button
              leftIcon={<Icon as={FiSave} />}
              w="100%"
              size="lg"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, orange.500, yellow.500)',
              }}
              shadow="md"
              onClick={handleUpdateUser}
              isLoading={isLoading}
              loadingText="Salvando..."
            >
              Salvar Alterações
            </Button>

            <Button
              leftIcon={<Icon as={FiLogOut} />}
              w="100%"
              size="lg"
              variant="outline"
              borderColor="red.500"
              color="red.500"
              _hover={{ bg: 'red.500', color: 'white' }}
              onClick={handleLogout}
            >
              Sair da Conta
            </Button>
          </VStack>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      endereco: response.data?.endereco,
    };

    return {
      props: {
        user: user,
        premium:
          response.data?.subscriptions?.status === 'active' ? true : false,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
});
