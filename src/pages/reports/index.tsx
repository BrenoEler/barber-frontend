import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Select,
  Text,
  Box,
  Divider,
  useMediaQuery,
  useColorModeValue,
  VStack,
  HStack,
  Grid,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  FiClipboard,
  FiDollarSign,
  FiArchive,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { ReportCard } from "../../components/reports/ReportCard";
import { FaFilePdf, FaTicket } from "react-icons/fa6";

//interface propriedades do relatório
export interface ReportProps {
  name: string;
  icon: IconType; //<--Import aquii
  value?: number;
  quantity?: number;
}

export default function Reports() {
  const [selectDate, setSelectDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [isTablet] = useMediaQuery("(max-width: 768px)");

  const borderColor = useColorModeValue("whiteAlpha.300", "gray.600");

  const reportItems: Array<ReportProps> = [
    // {
    //   name: "Relatório de agendamentos",
    //   icon: FiCalendar,
    // },
    {
      name: "Clientes atendidos",
      icon: FiEye,
      quantity: 500,
    },
    {
      name: "Ticket Médio",
      icon: FaTicket,
      value: 40,
    },
    {
      name: "Faturamento Líquido",
      icon: FiCalendar,
      value: 100,
    },
    {
      name: "Faturamento Bruto",
      icon: FiArchive,
      value: 1000,
    },
    {
      name: "Faturamento Líquido",
      icon: FiDollarSign,
      value: 700,
    },
  ];

  async function handleGenerateReport() {
    setIsLoading(true);
    try {
      // Simular uma requisição para gerar o relatório
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Aqui você pode adicionar a lógica real para gerar o relatório
      console.log("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Relatórios - Minha barbearia</title>
      </Head>

      <Sidebar>
        <Flex direction="column" w="100%" p={isMobile ? 2 : 6}>
          {/* Cabeçalho */}
          <Heading
            fontSize={isMobile ? "28px" : "3xl"}
            color="whiteAlpha.900"
            mb={6}
          >
            Relatórios
          </Heading>

          {/* Filtros */}
          <Box
            bg="barber.400"
            borderRadius="xl"
            p={6}
            mb={6}
            border="1px solid"
            borderColor={borderColor}
            shadow="md"
          >
            <VStack spacing={4} align="stretch">
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="whiteAlpha.700"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
              >
                Filtros de Relatório
              </Text>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={4}
              >
                <Box>
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.600"
                    mb={2}
                    fontWeight="medium"
                  >
                    Tipo de Relatório
                  </Text>
                  <Select
                    bg="barber.900"
                    color="whiteAlpha.900"
                    borderColor={borderColor}
                    _hover={{ borderColor: "orange.400" }}
                    _focus={{ borderColor: "orange.400" }}
                    size="md"
                  >
                    <option
                      value="1"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de agendamentos
                    </option>
                    <option
                      value="2"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de cortes
                    </option>
                    <option
                      value="3"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de clientes
                    </option>
                    <option
                      value="4"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de pagamentos
                    </option>
                    <option
                      value="5"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de usuários
                    </option>
                    <option
                      value="6"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de financeiro
                    </option>
                    <option
                      value="7"
                      style={{ backgroundColor: "#1b1c29", color: "#fff" }}
                    >
                      Relatório de estoque
                    </option>
                  </Select>
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.600"
                    mb={2}
                    fontWeight="medium"
                  >
                    Data Inicial
                  </Text>
                  <Input
                    type="date"
                    bg="barber.900"
                    color="whiteAlpha.900"
                    borderColor={borderColor}
                    _hover={{ borderColor: "orange.400" }}
                    _focus={{ borderColor: "orange.400" }}
                    size="md"
                  />
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.600"
                    mb={2}
                    fontWeight="medium"
                  >
                    Data Final
                  </Text>
                  <Input
                    type="date"
                    bg="barber.900"
                    color="whiteAlpha.900"
                    borderColor={borderColor}
                    _hover={{ borderColor: "orange.400" }}
                    _focus={{ borderColor: "orange.400" }}
                    size="md"
                  />
                </Box>

                <Flex align="flex-end">
                  <Button
                    w="100%"
                    size="md"
                    bgGradient="linear(to-r, orange.400, yellow.400)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, orange.500, yellow.500)",
                    }}
                    shadow="md"
                    onClick={handleGenerateReport}
                    loadingText="Gerando"
                    isLoading={isLoading}
                  >
                    Gerar Relatório
                  </Button>
                </Flex>
              </Grid>
            </VStack>
          </Box>

          <Divider borderColor={borderColor} mb={6} />

          {/* Cards de Métricas */}
          <Box mb={6}>
            <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900" mb={4}>
              Métricas Gerais
            </Text>
            {isLoading ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(5, 1fr)",
                }}
                gap={4}
              >
                {[...Array(5)].map((_, idx) => (
                  <Box
                    key={idx}
                    bg="barber.400"
                    borderRadius="xl"
                    overflow="hidden"
                    shadow="md"
                    border="1px solid"
                    borderColor={borderColor}
                    p={6}
                    minH="140px"
                  >
                    <VStack spacing={4} align="center">
                      <SkeletonCircle size="12" />
                      <Skeleton height="16px" width="80%" />
                      <Skeleton height="24px" width="60%" />
                    </VStack>
                  </Box>
                ))}
              </Grid>
            ) : (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(5, 1fr)",
                }}
                gap={4}
              >
                {reportItems.map((item, idx) => (
                  <ReportCard key={idx} item={item} />
                ))}
              </Grid>
            )}
          </Box>

          {/* Botão de Exportar */}
          <Flex justify="flex-end" mt={8}>
            <Button
              leftIcon={<Icon as={FaFilePdf} w={5} h={5} />}
              w={isMobile ? "100%" : "auto"}
              minW="200px"
              size="lg"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, orange.500, yellow.500)",
              }}
              shadow="md"
            >
              Exportar PDF
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}
