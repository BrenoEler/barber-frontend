import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import { Sidebar } from '../../../components/sidebar';

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';

import Link from 'next/link';
import Router from 'next/router';
import { FiChevronLeft, FiSave, FiScissors } from 'react-icons/fi';
import { toast } from 'sonner';

import { setupAPIClient } from '../../../services/api';
import { canSSRAuth } from '../../../utils/canSSRAuth';

interface NewHaircutProps {
  subscription: boolean;
  count: number;
}

export default function NewHaircut({ subscription, count }: NewHaircutProps) {
  const [isMobile] = useMediaQuery('(max-width: 500px)');

  const [name, setName] = useState('');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    const asNumber = Number(onlyDigits) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(isNaN(asNumber) ? 0 : asNumber);
    setPriceDisplay(formatted);
  }

  function parseBRLToNumber(brl: string) {
    const onlyDigits = brl.replace(/\D/g, '');
    const asNumber = Number(onlyDigits) / 100;
    return isNaN(asNumber) ? 0 : asNumber;
  }

  async function handleRegister() {
    if (name === '' || priceDisplay === '') {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const apiClient = setupAPIClient();
      await apiClient.post('/haircut', {
        name: name,
        price: parseBRLToNumber(priceDisplay),
      });

      toast.success('Modelo cadastrado com sucesso!');
      Router.push('/haircuts');
    } catch (err) {
      console.log(err);
      toast.error('Erro ao cadastrar esse modelo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Novo modelo de corte</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          w="100%"
          maxW="900px"
          p={isMobile ? 4 : 6}
        >
          <HStack spacing={4} mb={6} flexWrap="wrap">
            <Link href="/haircuts" prefetch={true}>
              <Button
                variant="ghost"
                leftIcon={<Icon as={FiChevronLeft} />}
                color="whiteAlpha.900"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Voltar
              </Button>
            </Link>
            <HStack spacing={3}>
              <Icon as={FiScissors} boxSize={8} color="button.cta" />
              <Heading
                color="whiteAlpha.900"
                fontSize={isMobile ? '2xl' : '3xl'}
              >
                Novo Modelo de Corte
              </Heading>
            </HStack>
          </HStack>

          <Box
            bg="barber.400"
            borderRadius="xl"
            p={isMobile ? 6 : 8}
            w="100%"
            border="1px solid"
            borderColor="whiteAlpha.200"
            shadow="lg"
          >
            <VStack spacing={6} align="stretch">
              {/* Informações do Modelo */}
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={FiScissors} color="button.cta" boxSize={5} />
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="whiteAlpha.900"
                  >
                    Informações do Modelo
                  </Text>
                </HStack>
                <Divider borderColor="whiteAlpha.200" mb={4} />

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel
                      color="whiteAlpha.700"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Nome do Corte *
                    </FormLabel>
                    <Input
                      placeholder="Ex: Corte + Barba, Corte Simples, etc."
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

                  <FormControl>
                    <FormLabel
                      color="whiteAlpha.700"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Preço *
                    </FormLabel>
                    <Input
                      placeholder="R$ 0,00"
                      size="lg"
                      bg="barber.900"
                      color="whiteAlpha.900"
                      borderColor="whiteAlpha.200"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      _hover={{ borderColor: 'button.cta' }}
                      _focus={{
                        borderColor: 'button.cta',
                        boxShadow: '0 0 0 1px button.cta',
                      }}
                    />
                    <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                      Digite o valor e ele será formatado automaticamente
                    </Text>
                  </FormControl>
                </VStack>
              </Box>

              <Divider borderColor="whiteAlpha.200" />

              {/* Limite de cortes */}
              {!subscription && count >= 3 && (
                <Alert
                  status="warning"
                  borderRadius="md"
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                >
                  <AlertIcon color="orange.500" />
                  <Box>
                    <Text
                      fontSize="sm"
                      color="orange.800"
                      fontWeight="medium"
                      mb={1}
                    >
                      Limite Atingido
                    </Text>
                    <Text fontSize="xs" color="orange.700">
                      Você atingiu o limite de 3 modelos no plano grátis.{' '}
                      <Link href="/planos">
                        <Text
                          as="span"
                          fontWeight="bold"
                          textDecoration="underline"
                          cursor="pointer"
                        >
                          Faça upgrade para Premium
                        </Text>
                      </Link>{' '}
                      e crie modelos ilimitados.
                    </Text>
                  </Box>
                </Alert>
              )}

              {/* Botão de Salvar */}
              <Button
                onClick={handleRegister}
                w="100%"
                size="lg"
                color="gray.900"
                bgGradient="linear(to-r, button.cta, #FFb13e)"
                _hover={{
                  bgGradient: 'linear(to-r, #FFb13e, button.cta)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                disabled={!subscription && count >= 3}
                loadingText="Cadastrando..."
                isLoading={isLoading}
                leftIcon={<Icon as={FiSave} />}
                fontWeight="bold"
                transition="all 0.2s"
              >
                Cadastrar Modelo
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/haircut/check');
    const count = await apiClient.get('/haircut/count');

    return {
      props: {
        subscription:
          response.data?.subscriptions?.status === 'active' ? true : false,
        count: count.data,
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
