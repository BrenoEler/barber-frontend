import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiScissors,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

export default function Home() {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const features = [
    {
      icon: FiCalendar,
      title: 'Agendamento Inteligente',
      description:
        'Gerencie todos os seus agendamentos em um só lugar com interface intuitiva e moderna.',
    },
    {
      icon: FiScissors,
      title: 'Gestão de Cortes',
      description:
        'Cadastre e organize seus modelos de corte com preços e informações detalhadas.',
    },
    {
      icon: FiBarChart2,
      title: 'Relatórios Completos',
      description:
        'Acompanhe seu desempenho com relatórios detalhados e análises de negócio.',
    },
    {
      icon: FiDollarSign,
      title: 'Controle Financeiro',
      description:
        'Tenha controle total sobre seu caixa e receitas com ferramentas profissionais.',
    },
    {
      icon: FiUsers,
      title: 'Base de Clientes',
      description:
        'Mantenha um cadastro completo de seus clientes com histórico de serviços.',
    },
    {
      icon: FiTrendingUp,
      title: 'Crescimento Garantido',
      description:
        'Ferramentas que ajudam seu negócio a crescer e se destacar no mercado.',
    },
  ];

  return (
    <>
      <Head>
        <title>BarberPRO - Seu sistema completo para barbearias</title>
        <meta
          name="description"
          content="Sistema completo de gestão para barbearias. Agendamentos, cortes, relatórios e muito mais."
        />
      </Head>

      <Box bg="barber.900" minH="100vh" position="relative" overflow="hidden">
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.05}
          backgroundImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
          backgroundSize="40px 40px"
        />

        {/* Navigation */}
        <Container maxW="container.xl" py={6} position="relative" zIndex={1}>
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Text
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold"
                color="white"
              >
                Barber
              </Text>
              <Text
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold"
                color="button.cta"
              >
                PRO
              </Text>
            </HStack>
            <HStack spacing={4}>
              <Link href="/login">
                <Button
                  variant="ghost"
                  color="whiteAlpha.900"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  bgGradient="linear(to-r, button.cta, #FFb13e)"
                  color="gray.900"
                  _hover={{ bgGradient: 'linear(to-r, #FFb13e, button.cta)' }}
                  fontWeight="bold"
                >
                  Começar Agora
                </Button>
              </Link>
            </HStack>
          </Flex>
        </Container>

        {/* Hero Section */}
        <Container maxW="container.xl" py={20} position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <Badge
              bg="button.cta"
              color="gray.900"
              px={4}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              Sistema Completo de Gestão
            </Badge>

            <Heading
              fontSize={isMobile ? '4xl' : '6xl'}
              fontWeight="extrabold"
              bgGradient="linear(to-r, white, button.cta)"
              bgClip="text"
              lineHeight="1.2"
            >
              Gerencie sua Barbearia
              <br />
              de Forma Profissional
            </Heading>

            <Text
              fontSize={isMobile ? 'lg' : 'xl'}
              color="whiteAlpha.700"
              maxW="600px"
              lineHeight="1.8"
            >
              Tudo que você precisa para administrar sua barbearia em um só
              lugar. Agendamentos, cortes, relatórios e controle financeiro na
              palma da sua mão.
            </Text>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Link href="/register">
                <Button
                  size="lg"
                  bgGradient="linear(to-r, button.cta, #FFb13e)"
                  color="gray.900"
                  _hover={{
                    bgGradient: 'linear(to-r, #FFb13e, button.cta)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  rightIcon={<FiArrowRight />}
                  fontWeight="bold"
                  px={8}
                  transition="all 0.2s"
                >
                  Começar Grátis
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.300"
                  color="whiteAlpha.900"
                  _hover={{ bg: 'whiteAlpha.200', borderColor: 'button.cta' }}
                  fontWeight="semibold"
                  px={8}
                >
                  Já tenho conta
                </Button>
              </Link>
            </HStack>
          </VStack>
        </Container>

        {/* Features Section */}
        <Box bg="barber.400" py={20} position="relative" zIndex={1}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={isMobile ? '3xl' : '4xl'}
                  color="whiteAlpha.900"
                >
                  Funcionalidades Completas
                </Heading>
                <Text fontSize="lg" color="whiteAlpha.700" maxW="600px">
                  Tudo que você precisa para gerenciar sua barbearia com
                  eficiência e profissionalismo
                </Text>
              </VStack>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={8}
                w="100%"
              >
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    bg="barber.900"
                    p={6}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    _hover={{
                      borderColor: 'button.cta',
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s"
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={10}
                      color="button.cta"
                      mb={4}
                    />
                    <Heading fontSize="xl" color="whiteAlpha.900" mb={2}>
                      {feature.title}
                    </Heading>
                    <Text color="whiteAlpha.700" lineHeight="1.7">
                      {feature.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* CTA Section */}
        <Container maxW="container.xl" py={20} position="relative" zIndex={1}>
          <Box
            bgGradient="linear(to-r, button.cta, #FFb13e)"
            borderRadius="2xl"
            p={isMobile ? 8 : 12}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              width="200px"
              height="200px"
              bg="whiteAlpha.200"
              borderRadius="full"
              transform="translate(30%, -30%)"
            />
            <VStack spacing={6} position="relative" zIndex={1}>
              <Heading fontSize={isMobile ? '3xl' : '4xl'} color="gray.900">
                Pronto para Transformar sua Barbearia?
              </Heading>
              <Text fontSize="lg" color="gray.800" maxW="600px">
                Comece hoje mesmo e veja como é fácil gerenciar seu negócio de
                forma profissional
              </Text>
              <Link href="/register">
                <Button
                  size="lg"
                  bg="gray.900"
                  color="white"
                  _hover={{
                    bg: 'gray.800',
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  rightIcon={<FiArrowRight />}
                  fontWeight="bold"
                  px={8}
                  transition="all 0.2s"
                >
                  Criar Conta Grátis
                </Button>
              </Link>
            </VStack>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          bg="barber.900"
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
          py={8}
        >
          <Container maxW="container.xl">
            <Flex
              direction={isMobile ? 'column' : 'row'}
              justify="space-between"
              align="center"
              spacing={4}
            >
              <HStack spacing={2}>
                <Text
                  fontSize="xl"
                  fontFamily="monospace"
                  fontWeight="bold"
                  color="white"
                >
                  Barber
                </Text>
                <Text
                  fontSize="xl"
                  fontFamily="monospace"
                  fontWeight="bold"
                  color="button.cta"
                >
                  PRO
                </Text>
              </HStack>
              <Text color="whiteAlpha.600" fontSize="sm" mt={isMobile ? 4 : 0}>
                © {new Date().getFullYear()} BarberPRO. Todos os direitos
                reservados.
              </Text>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
}
