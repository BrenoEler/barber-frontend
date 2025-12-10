import { useState, ChangeEvent } from "react";

import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
  Flex,
  Text,
  Heading,
  Button,
  Stack,
  Switch,
  useMediaQuery,
  Link as ChakraLink,
  Grid,
  Box,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Divider,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";

import Link from "next/link";

import { IoMdPricetag } from "react-icons/io";
import { FiScissors, FiDollarSign } from "react-icons/fi";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id: string;
}

interface HaircutsProps {
  haircuts: HaircutsItem[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [haircutList, setHaircutList] = useState<HaircutsItem[]>(
    haircuts || []
  );
  const [disableHaircut, setDisableHaircut] = useState("enabled");
  const [isLoading, setIsLoading] = useState(false);

  const cardBg = useColorModeValue("barber.400", "gray.800");
  const borderColor = useColorModeValue("black", "gray.600");

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    const apiClient = setupAPIClient();
    setIsLoading(true);

    try {
      if (e.target.value === "disabled") {
        setDisableHaircut("enabled");

        const response = await apiClient.get("/haircuts", {
          params: {
            status: true,
          },
        });

        setHaircutList(response.data);
      } else {
        setDisableHaircut("disabled");
        const response = await apiClient.get("/haircuts", {
          params: {
            status: false,
          },
        });

        setHaircutList(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar cortes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Modelos de corte - Minha barbearia</title>
      </Head>
      <Sidebar>
        <Flex direction="column" w="100%" p={isMobile ? 2 : 6}>
          {/* Cabeçalho */}
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            mb={6}
            flexWrap="wrap"
            gap={4}
          >
            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              color={useColorModeValue("black", "whiteAlpha.900")}
            >
              Modelos de corte
            </Heading>

            <Flex
              direction={isMobile ? "column" : "row"}
              align="center"
              gap={4}
              w={isMobile ? "100%" : "auto"}
            >
              <Link href="/haircuts/new" prefetch={true}>
                <Button
                  bgGradient="linear(to-r, orange.400, yellow.400)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, orange.500, yellow.500)",
                  }}
                  shadow="md"
                  px={6}
                >
                  Cadastrar novo
                </Button>
              </Link>

              <Stack align="center" direction="row">
                <Text fontWeight="bold" color={useColorModeValue("black", "whiteAlpha.900")}>
                  ATIVOS
                </Text>
                <Switch
                    sx={{
                    ".chakra-switch__track[data-checked]": {
                      bg: "#38ca7aff",
                    },
                  }}
                  size="lg"
                  value={disableHaircut}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDisable(e)
                  }
                  isChecked={disableHaircut === "disabled" ? false : true}
                />
              </Stack>
            </Flex>
          </Flex>

          <Divider borderColor={borderColor} mb={6} />

          {/* Grid de Cards */}
          {isLoading ? (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={4}
              w="100%"
            >
              {[...Array(8)].map((_, idx) => (
                <Box
                  key={idx}
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  shadow="md"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex
                    bg="barber.900"
                    p={4}
                    align="center"
                    justify="center"
                    minH="120px"
                  >
                    <SkeletonCircle size="12" />
                  </Flex>
                  <VStack p={4} align="stretch" spacing={3} bg={cardBg}>
                    <Skeleton height="20px" width="80%" />
                    <Divider borderColor={borderColor} />
                    <Skeleton height="24px" width="60%" />
                    <Divider borderColor={borderColor} />
                    <Skeleton height="14px" width="50%" />
                  </VStack>
                </Box>
              ))}
            </Grid>
          ) : haircutList.length === 0 ? (
            <Text color="whiteAlpha.700" textAlign="center" mt={10}>
              Nenhum corte cadastrado no momento.
            </Text>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={4}
              w="100%"
            >
              {haircutList.map((haircut) => (
                <ChakraLink
                  as={Link}
                  key={haircut.id}
                  href={`/haircuts/${haircut.id}`}
                  prefetch={true}
                  _hover={{ textDecoration: "none" }}
                >
                  <Box
                    bg={cardBg}
                    borderRadius="xl"
                    overflow="hidden"
                    shadow="md"
                    border="1px solid"
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "lg",
                      borderColor: "orange.400",
                    }}
                    cursor="pointer"
                    h="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    {/* Header do Card com Status */}
                    <Flex
                      bg="barber.900"
                      p={4}
                      align="center"
                      justify="center"
                      minH="120px"
                      position="relative"
                    >
                      <Icon
                        as={FiScissors}
                        boxSize={12}
                        color="orange.400"
                        opacity={0.8}
                      />
                      {!haircut.status && (
                        <Badge
                          position="absolute"
                          top={2}
                          right={2}
                          bg="red.500"
                          color="white"
                          px={3}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          INATIVO
                        </Badge>
                      )}
                    </Flex>

                    {/* Conteúdo do Card */}
                    <VStack
                      p={4}
                      align="stretch"
                      spacing={3}
                      flex={1}
                      bg={cardBg}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="whiteAlpha.900"
                        noOfLines={2}
                        minH="3.5rem"
                      >
                        {haircut.name}
                      </Text>

                      <Divider borderColor={borderColor} />

                      <HStack spacing={2} align="center">
                        <Icon as={FiDollarSign} color="green.400" boxSize={5} />
                        <Text fontWeight="bold" fontSize="xl" color="green.400">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(haircut.price))}
                        </Text>
                      </HStack>

                      <HStack spacing={2} align="center" mt="auto">
                        <Icon
                          as={IoMdPricetag}
                          color="orange.300"
                          boxSize={5}
                        />
                        <Text
                          fontSize="sm"
                          color="whiteAlpha.700"
                          fontWeight="medium"
                        >
                          ID: {haircut.id.slice(0, 8)}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </ChakraLink>
              ))}
            </Grid>
          )}
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: {
        status: true,
      },
    });

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        haircuts: response.data,
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
