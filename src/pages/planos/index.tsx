import Head from "next/head";
import { 
  Button, 
  Flex, 
  Heading, 
  Text, 
  useMediaQuery,
  Box,
  VStack,
  HStack,
  Icon,
  Badge,
  Divider,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { 
  FiCheck, 
  FiCrown, 
  FiArrowRight,
  FiStar,
} from "react-icons/fi";

import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { getStripeJs } from "../../utils/stripe.js";

interface PlanosProps {
  premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const borderColor = useColorModeValue("whiteAlpha.300", "gray.600");

  const handleSubscribe = async () => {
    if (premium) {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (err) {
      console.log(err);
    }
  };

  async function handleCreatePortal() {
    try {
      if (!premium) {
        return;
      }

      const apiClient = setupAPIClient();
      const response = await apiClient.post("/create-portal");

      const { sessionId } = response.data;

      window.location.href = sessionId;
    } catch (err) {
      console.log(err.message);
    }
  }

  const freeFeatures = [
    "Registrar cortes",
    "Criar até 3 modelos de corte",
    "Editar dados do perfil",
    "Acesso básico ao sistema",
  ];

  const premiumFeatures = [
    "Registrar cortes ilimitados",
    "Criar modelos ilimitados",
    "Editar modelos de corte",
    "Editar dados do perfil",
    "Receber todas atualizações",
    "Solicita agendamentos via Telegram",
    "Editar landing page personalizada",
    "Suporte prioritário",
  ];

  return (
    <>
      <Head>
        <title>Barber Pro - Planos e Assinaturas</title>
      </Head>
      <Sidebar>
        <Flex
          w="100%"
          direction="column"
          align="flex-start"
          justify="flex-start"
          p={isMobile ? 4 : 6}
          maxW="1200px"
        >
          <VStack spacing={2} align="flex-start" mb={8}>
            <HStack spacing={3}>
              <Icon as={FiCrown} boxSize={8} color="button.cta" />
              <Heading color="whiteAlpha.900" fontSize="3xl">
                Planos e Assinaturas
              </Heading>
            </HStack>
            <Text color="whiteAlpha.700" fontSize="lg">
              Escolha o plano ideal para sua barbearia
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="100%">
            {/* Plano Grátis */}
            <Box
              bg="barber.400"
              borderRadius="xl"
              p={8}
              border="2px solid"
              borderColor={borderColor}
              position="relative"
              _hover={{
                borderColor: "whiteAlpha.400",
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s"
            >
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading fontSize="2xl" color="whiteAlpha.900" mb={2}>
                    Plano Grátis
                  </Heading>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    Perfeito para começar
                  </Text>
                </Box>

                <Divider borderColor={borderColor} />

                <VStack spacing={4} align="stretch">
                  {freeFeatures.map((feature, index) => (
                    <HStack key={index} spacing={3}>
                      <Icon as={FiCheck} color="green.400" boxSize={5} />
                      <Text color="whiteAlpha.800" fontSize="sm">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Box pt={4}>
                  <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    color="whiteAlpha.900"
                    mb={1}
                  >
                    R$ 0
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    Para sempre
                  </Text>
                </Box>

                <Button
                  w="100%"
                  size="lg"
                  variant="outline"
                  borderColor={borderColor}
                  color="whiteAlpha.900"
                  _hover={{
                    bg: "whiteAlpha.200",
                    borderColor: "whiteAlpha.400",
                  }}
                  isDisabled
                >
                  Plano Atual
                </Button>
              </VStack>
            </Box>

            {/* Plano Premium */}
            <Box
              bgGradient="linear(to-br, orange.500, yellow.500)"
              borderRadius="xl"
              p={8}
              border="2px solid"
              borderColor="orange.300"
              position="relative"
              overflow="hidden"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "2xl",
              }}
              transition="all 0.3s"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "150px",
                bg: "whiteAlpha.200",
                borderRadius: "full",
                transform: "translate(30%, -30%)",
              }}
            >
              <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
                <Flex justify="space-between" align="flex-start">
                  <Box>
                    <HStack spacing={2} mb={2}>
                      <Heading fontSize="2xl" color="gray.900">
                        Premium
                      </Heading>
                      <Badge
                        bg="gray.900"
                        color="yellow.300"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        RECOMENDADO
                      </Badge>
                    </HStack>
                    <Text color="gray.800" fontSize="sm" fontWeight="medium">
                      Acesso completo a todas funcionalidades
                    </Text>
                  </Box>
                  <Icon as={FiStar} boxSize={8} color="yellow.200" />
                </Flex>

                <Divider borderColor="whiteAlpha.300" />

                <VStack spacing={4} align="stretch">
                  {premiumFeatures.map((feature, index) => (
                    <HStack key={index} spacing={3}>
                      <Icon as={FiCheck} color="gray.900" boxSize={5} />
                      <Text color="gray.800" fontSize="sm" fontWeight="medium">
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Box pt={4}>
                  <HStack spacing={2} align="baseline">
                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      color="gray.900"
                      mb={1}
                    >
                      R$ 9,99
                    </Text>
                    <Text color="gray.700" fontSize="sm">
                      /mês
                    </Text>
                  </HStack>
                  <Text color="gray.700" fontSize="xs" mt={1}>
                    Cancele quando quiser
                  </Text>
                </Box>

                {premium ? (
                  <VStack spacing={3}>
                    <Button
                      w="100%"
                      size="lg"
                      bg="gray.900"
                      color="white"
                      _hover={{ bg: "gray.800" }}
                      onClick={handleCreatePortal}
                      rightIcon={<FiArrowRight />}
                      fontWeight="bold"
                    >
                      Gerenciar Assinatura
                    </Button>
                    <Badge
                      bg="green.500"
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      ✓ Você já é Premium
                    </Badge>
                  </VStack>
                ) : (
                  <Button
                    w="100%"
                    size="lg"
                    bg="gray.900"
                    color="white"
                    _hover={{
                      bg: "gray.800",
                      transform: "scale(1.02)",
                    }}
                    onClick={handleSubscribe}
                    rightIcon={<FiArrowRight />}
                    fontWeight="bold"
                    transition="all 0.2s"
                  >
                    Assinar Premium
                  </Button>
                )}
              </VStack>
            </Box>
          </SimpleGrid>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    return {
      props: {
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
