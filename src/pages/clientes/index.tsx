// pages/clientes/index.tsx
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useDisclosure,
  Box,
  VStack,
  HStack,
  Icon,
  Badge,
  Grid,
  useColorModeValue,
  useMediaQuery,
  Skeleton,
  SkeletonCircle,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useMemo } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoMdPerson, IoMdMail, IoMdCall } from "react-icons/io";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { Cliente, CreateUserModal } from "../../components/cliente-edit-modal";
import { Sidebar } from "../../components/sidebar";
// import { setupAPIClient } from "../../services/api";
// import { api } from "@/services/apiClient";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 7,
      name: "Ronaldo",
      celular: "27999999999",
      email: "teste@teste.com",
      endereco: "Rua 1",
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelectedClient] = useState<Cliente | null>(null);

  // Abrir modal em modo "criar"
  const handleCreate = () => {
    setSelectedClient(null);
    onOpen();
  };

  // Abrir modal em modo "editar"
  const handleRowClick = (cliente: Cliente) => {
    setSelectedClient(cliente);
    onOpen();
  };

  // Salvar (criar ou editar) vindo do modal
  const handleSaveUser = (data: Omit<Cliente, "id"> & { id?: number }) => {
    // Aqui seria o lugar pra chamar a API (POST/PUT)
    // const api = setupAPIClient();

    if (data.id) {
      // Edição
      // await api.put(`/clientes/${data.id}`, data);
      setClientes((prev) =>
        prev.map((c) => (c.id === data.id ? { ...(c as Cliente), ...data } : c))
      );
    } else {
      // Criação
      // const response = await api.post("/clientes", data);
      // const created = response.data as Cliente;

      const novo: Cliente = {
        id: clientes.length + 1, // mock de ID, até ter API
        name: data.name,
        celular: data.celular,
        email: data.email,
        endereco: data.endereco,
      };

      setClientes((prev) => [...prev, novo]);
    }

    onClose();
  };

  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [isLoading, setIsLoading] = useState(false);
  const cardBg = useColorModeValue("barber.400", "gray.800");
  const borderColor = useColorModeValue("black", "gray.600");

  // Filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "id">("name");

  // Filtrar e ordenar lista
  const filteredClientes = useMemo(() => {
    let filtered = [...clientes];

    // Pesquisa
    if (searchTerm) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.celular.includes(searchTerm)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.id - b.id;
    });

    return filtered;
  }, [clientes, searchTerm, sortBy]);

  // Formatar celular
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (cleaned.length === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
    }
    return phone;
  };

  return (
    <Sidebar>
      <Head>
        <title>Clientes - Minha barbearia</title>
      </Head>

      <Flex direction="column" w="100%" p={isMobile ? 2 : 6}>
        {/* Cabeçalho */}
        <Flex
          direction={isMobile ? "column" : "row"}
          w="100%"
          align={isMobile ? "flex-start" : "center"}
          justify="space-between"
          mb={6}
          flexWrap="wrap"
          gap={4}
        >
          <Heading fontSize={isMobile ? "28px" : "3xl"} color={useColorModeValue("black", "whiteAlpha.900")}>
            Clientes
          </Heading>

          <Flex
            direction={isMobile ? "column" : "row"}
            align="center"
            gap={3}
            w={isMobile ? "100%" : "auto"}
          >
            <Button
              onClick={handleCreate}
              bgGradient="linear(to-r, orange.400, yellow.400)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              shadow="md"
              px={6}
              leftIcon={<IoIosAdd size={24} />}
            >
              Novo Cliente
            </Button>

          </Flex>
        </Flex>

        <Divider borderColor={borderColor} mb={6} />

        {/* Filtros e Pesquisa */}
        <Flex
          direction={isMobile ? "column" : "row"}
          gap={4}
          mb={6}
          flexWrap="wrap"
        >
          <InputGroup flex={1} minW={isMobile ? "100%" : "300px"}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="whiteAlpha.500" />
            </InputLeftElement>
            <Input
              placeholder="Pesquisar por nome, email ou telefone..."
              bg="barber.900"
              color="whiteAlpha.900"
              borderColor={borderColor}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              _hover={{ borderColor: "button.cta" }}
              _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
            />
          </InputGroup>

          <Select
            w={isMobile ? "100%" : "200px"}
            bg="barber.900"
            color="whiteAlpha.900"
            borderColor={borderColor}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "id")}
            _hover={{ borderColor: "button.cta" }}
          >
            <option value="name" style={{ backgroundColor: "#1a202c" }}>Ordenar por Nome</option>
            <option value="id" style={{ backgroundColor: "#1a202c" }}>Ordenar por ID</option>
          </Select>
        </Flex>

        {/* Grid de Cards */}
        {isLoading ? (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            {[...Array(6)].map((_, idx) => (
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
                  p={5}
                  direction="column"
                  gap={3}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" gap={3}>
                    <SkeletonCircle size="12" />
                    <VStack align="flex-start" spacing={2} flex={1}>
                      <Skeleton height="20px" width="60%" />
                      <Skeleton height="12px" width="40%" />
                    </VStack>
                  </Flex>
                </Flex>
                <VStack p={5} align="stretch" spacing={3} bg={cardBg}>
                  <Box>
                    <Skeleton height="12px" width="30%" mb={1} />
                    <Skeleton height="16px" width="80%" />
                  </Box>
                  <Divider borderColor={borderColor} />
                  <Box>
                    <Skeleton height="12px" width="30%" mb={1} />
                    <Skeleton height="16px" width="90%" />
                  </Box>
                  <Divider borderColor={borderColor} />
                  <Box>
                    <Skeleton height="12px" width="40%" mb={1} />
                    <Skeleton height="16px" width="70%" />
                  </Box>
                </VStack>
              </Box>
            ))}
          </Grid>
        ) : filteredClientes.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="400px"
            color="whiteAlpha.600"
          >
            <Icon as={IoMdPerson} boxSize={16} mb={4} opacity={0.5} />
            <Text fontSize="lg" fontWeight="medium">
              {searchTerm 
                ? "Nenhum cliente encontrado com a pesquisa"
                : "Nenhum cliente cadastrado"}
            </Text>
            <Text fontSize="sm" mt={2}>
              {searchTerm
                ? "Tente ajustar os termos de pesquisa"
                : "Adicione seu primeiro cliente para começar"}
            </Text>
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            {filteredClientes.map((cliente) => (
              <Box
                key={cliente.id}
                bg={cardBg}
                borderRadius="xl"
                overflow="hidden"
                shadow="md"
                border="1px solid"
                borderColor={borderColor}
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "xl",
                  borderColor: "orange.400",
                }}
                cursor="pointer"
                onClick={() => handleRowClick(cliente)}
                position="relative"
              >
                {/* Badge de ID */}
                <Box position="absolute" top={3} right={3} zIndex={1}>
                  <Badge
                    bg="orange.400"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    ID: {cliente.id}
                  </Badge>
                </Box>

                {/* Header do Card */}
                <Flex
                  bg="barber.900"
                  p={5}
                  direction="column"
                  gap={3}
                  borderBottom="1px solid"
                  borderColor={borderColor}
                >
                  <Flex align="center" gap={3}>
                    <Flex
                      align="center"
                      justify="center"
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="orange.400"
                      opacity={0.2}
                    >
                      <Icon as={IoMdPerson} boxSize={6} color="orange.300" />
                    </Flex>
                    <VStack align="flex-start" spacing={0} flex={1}>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="whiteAlpha.900"
                        noOfLines={1}
                      >
                        {cliente.name}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.600"
                        fontWeight="medium"
                      >
                        Cliente
                      </Text>
                    </VStack>
                  </Flex>
                </Flex>

                {/* Conteúdo do Card */}
                <VStack p={5} align="stretch" spacing={3} bg={cardBg}>
                  {/* Celular */}
                  {cliente.celular && (
                    <Box>
                      <HStack spacing={2} mb={1}>
                        <Icon as={IoMdCall} color="green.400" boxSize={4} />
                        <Text
                          fontSize="xs"
                          color="whiteAlpha.600"
                          fontWeight="medium"
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          Celular
                        </Text>
                      </HStack>
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        color="whiteAlpha.900"
                        pl={6}
                      >
                        {formatPhone(cliente.celular)}
                      </Text>
                    </Box>
                  )}

                  {/* Email */}
                  {cliente.email && (
                    <>
                      <Divider borderColor={borderColor} />
                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={IoMdMail} color="blue.400" boxSize={4} />
                          <Text
                            fontSize="xs"
                            color="whiteAlpha.600"
                            fontWeight="medium"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            Email
                          </Text>
                        </HStack>
                        <Text
                          fontWeight="medium"
                          fontSize="sm"
                          color="whiteAlpha.900"
                          pl={6}
                          noOfLines={1}
                        >
                          {cliente.email}
                        </Text>
                      </Box>
                    </>
                  )}

                  {/* Endereço */}
                  {cliente.endereco && (
                    <>
                      <Divider borderColor={borderColor} />
                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Icon as={FiMapPin} color="orange.300" boxSize={4} />
                          <Text
                            fontSize="xs"
                            color="whiteAlpha.600"
                            fontWeight="medium"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            Endereço
                          </Text>
                        </HStack>
                        <Text
                          fontWeight="medium"
                          fontSize="sm"
                          color="whiteAlpha.900"
                          pl={6}
                          noOfLines={2}
                        >
                          {cliente.endereco}
                        </Text>
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>
            ))}
          </Grid>
        )}
      </Flex>

      {/* Modal de criar/editar */}
      <CreateUserModal
        isOpen={isOpen}
        onClose={onClose}
        cliente={selected}
        onSave={handleSaveUser}
      />
    </Sidebar>
  );
}
