import { useState, useEffect, ChangeEvent } from "react";
import {
  Flex,
  Heading,
  Button,
  Input,
  Text,
  Box,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Grid,
  Badge,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import Head from "next/head";
import { FaClock } from "react-icons/fa";

const valoresPadrao = {
  titulo: "Agendamento",
  logoImg: "/images/logo.svg",
  horarios: [
    { dia: "Segunda-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Terça-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Quarta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Quinta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Sexta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Sábado", inicio: "09:00", fim: "16:00", ativo: true },
    { dia: "Domingo", inicio: "09:00", fim: "14:00", ativo: false },
  ],
  textoAviso:
    "Seu agendamento não será aceito de imediato, o barbeiro terá que aprovar o agendamento. Caso aprovado ou reprovado, a devolutiva será enviada via WhatsApp.",
  exibirAviso: true,
  camposAtivos: {
    nome: true,
    email: true,
    celular: true,
    data: true,
    horario: true,
    corte: true,
  },
};

// Componente BusinessHoursChip
function BusinessHoursChip({ horarios }: { horarios: any[] }) {
  const schedule: any = {};
  
  // Mapeia os horários configurados para o formato esperado
  const diasMap: any = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5,
    "Sábado": 6,
    "Domingo": 0,
  };

  horarios.forEach((h) => {
    if (h.ativo) {
      const [openH, openM] = h.inicio.split(":").map(Number);
      const [closeH, closeM] = h.fim.split(":").map(Number);
      schedule[diasMap[h.dia]] = {
        open: openH * 60 + openM,
        close: closeH * 60 + closeM,
      };
    }
  });

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  const todaysHours = schedule[dayOfWeek];
  let isOpen = false;
  let statusText = "Fechado";
  let hoursText = "Fechado hoje";

  if (todaysHours) {
    isOpen =
      currentTimeInMinutes >= todaysHours.open &&
      currentTimeInMinutes < todaysHours.close;

    if (isOpen) {
      statusText = "Aberto agora";
      hoursText = `Fecha às ${formatTime(todaysHours.close)}`;
    } else if (currentTimeInMinutes < todaysHours.open) {
      statusText = "Fechado";
      hoursText = `Abre às ${formatTime(todaysHours.open)}`;
    } else {
      statusText = "Fechado";
      let nextDay = dayOfWeek + 1;
      while (!schedule[nextDay % 7] && nextDay < dayOfWeek + 7) {
        nextDay++;
      }
      const nextOpeningDay = schedule[nextDay % 7];
      if (nextOpeningDay) {
        hoursText = `Abre amanhã às ${formatTime(nextOpeningDay.open)}`;
      }
    }
  }

  // Gera texto dos horários
  const getHoursText = () => {
    const diasAtivos = horarios.filter((h) => h.ativo);
    if (diasAtivos.length === 0) return "Sem horários definidos";
    
    // Agrupa dias com mesmo horário
    const grupos: any = {};
    diasAtivos.forEach((h) => {
      const key = `${h.inicio}-${h.fim}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(h.dia);
    });

    return Object.entries(grupos)
      .map(([horario, dias]: any) => {
        const [inicio, fim] = horario.split("-");
        if (dias.length === 1) {
          return `${dias[0].slice(0, 3)}: ${inicio} - ${fim}`;
        }
        return `${dias[0].slice(0, 3)} - ${dias[dias.length - 1].slice(0, 3)}: ${inicio} - ${fim}`;
      })
      .join(" | ");
  };
  
  return (
    <HStack
      border="1px solid"
      borderColor={isOpen ? "green.200" : "red.200"}
      bg={isOpen ? "green.50" : "red.50"}
      borderRadius="10px"
      px={4}
      py={2}
      spacing={3}
      align="center"
    >
      <Badge
        colorScheme={isOpen ? "green" : "red"}
        variant="solid"
        borderRadius="full"
        px={2}
      >
        {statusText}
      </Badge>
      <HStack spacing={2} align="center" color="gray.600">
        <Icon as={FaClock} />
        <Text fontSize="sm">{getHoursText()}</Text>
      </HStack>
    </HStack>
  );
}

export default function EditarLandingPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  // Estados do formulário preview
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [haircutId, setHaircutId] = useState("");
  const [haircuts, setHaircuts] = useState([
    { id: "1", name: "Corte + Barba" },
    { id: "2", name: "Corte Simples" },
    { id: "3", name: "Barba" },
  ]);

  // Configurações editáveis
  const [titulo, setTitulo] = useState("Agendamento");
  const [logoImg, setLogoImg] = useState("/images/logo.svg");
  
  const [horarios, setHorarios] = useState([
    { dia: "Segunda-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Terça-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Quarta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Quinta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Sexta-feira", inicio: "09:00", fim: "18:00", ativo: true },
    { dia: "Sábado", inicio: "09:00", fim: "16:00", ativo: true },
    { dia: "Domingo", inicio: "09:00", fim: "14:00", ativo: false },
  ]);

  const [textoAviso, setTextoAviso] = useState(
    "Seu agendamento não será aceito de imediato, o barbeiro terá que aprovar o agendamento. Caso aprovado ou reprovado, a devolutiva será enviada via WhatsApp."
  );
  const [exibirAviso, setExibirAviso] = useState(true);

  const [camposAtivos, setCamposAtivos] = useState({
    nome: true,
    email: true,
    celular: true,
    data: true,
    horario: true,
    corte: true,
  });

  function formatarCelular(valor: string) {
    valor = valor.replace(/\D/g, "");
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d*)/, "$1");
    }
    return valor;
  }

    const handleReset = () => {
    setTitulo(valoresPadrao.titulo);
    setLogoImg(valoresPadrao.logoImg);
    setHorarios(valoresPadrao.horarios);
    setTextoAviso(valoresPadrao.textoAviso);
    setExibirAviso(valoresPadrao.exibirAviso);

    toast({
        title: "Configurações resetadas!",
        description: "As configurações voltaram ao padrão original.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
    });
    };


  function handerChanger(e: React.ChangeEvent<HTMLInputElement>) {
    setCelular(formatarCelular(e.target.value));
  }

  const handleUpdateHorario = (index: number, field: string, value: any) => {
    const novosHorarios = [...horarios];
    novosHorarios[index] = { ...novosHorarios[index], [field]: value };
    setHorarios(novosHorarios);
  };

  const handleSalvar = async () => {
    setIsLoading(true);
    try {
      const config = {
        titulo,
        logoImg,
        horarios,
        textoAviso,
        exibirAviso,
        camposAtivos,
      };

      const res = await fetch(`${apiBase}/landing-page-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      toast({
        title: "Configurações salvas!",
        description: "Sua landing page foi atualizada com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PreviewLandingPage = () => {
    return (
      <Flex
        minH="100vh"
        bg="barber.900"
        direction="column"
        align="center"
        justify="flex-start"
        p={4}
        gap="10"
        position="sticky"
        top="20px"
        maxH="calc(100vh - 40px)"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.1)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#FF8C00",
            borderRadius: "4px",
          },
        }}
      >
        <Head>
          <title>Editar Landing Page</title>
        </Head>
        <Heading
          fontSize="3xl"
          mt={4}
          mb={4}
          bgGradient="linear(to-b, orange.400, yellow.400)"
          bgClip="text"
          fontWeight="extrabold"
        >
          {titulo}
        </Heading>

        <Flex
          maxW="700px"
          pt={8}
          pb={8}
          width="100%"
          direction="column"
          borderRadius="3xl"
          align="center"
          justify="center"
          bgGradient="linear(to-b, barber.900, barber.400)"
        >
          <Flex
            w="50"
            h="50"
            pb={6}
            rounded="full"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={logoImg} alt="Logo" width={150} height={150} />
          </Flex>
          
          <Flex margin="5">
            <BusinessHoursChip horarios={horarios} />
          </Flex>

          {camposAtivos.nome && (
            <Input
              type="text"
              mt={4}
              mb={3}
              placeholder="Nome"
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              w="85%"
              size="lg"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          {camposAtivos.email && (
            <Input
              type="email"
              mb={3}
              placeholder="E-mail"
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              w="85%"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {camposAtivos.celular && (
            <Input
              placeholder="(27) 99999-9999"
              w="85%"
              mb={3}
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              size="lg"
              type="tel"
              value={celular}
              onChange={handerChanger}
            />
          )}

          {camposAtivos.data && (
            <Input
              type="date"
              w="85%"
              mb={3}
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              size="lg"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          )}

          {camposAtivos.horario && (
            <Input
              type="time"
              w="85%"
              mb={3}
              size="lg"
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          )}

          {camposAtivos.corte && (
            <Select
              color="white"
              mb={3}
              _hover={{
                borderColor: "white",
                bg: "barber.900",
              }}
              _focus={{
                borderColor: "white",
                bg: "barber.900",
              }}
              borderColor="barber.900"
              bg="barber.400"
              size="lg"
              w="85%"
              placeholder="Selecione um corte"
              value={haircutId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setHaircutId(e.target.value)
              }
            >
              {haircuts.map((h) => (
                <option
                  key={h.id}
                  value={h.id}
                  style={{ backgroundColor: "#FFF", color: "#000" }}
                >
                  {h.name}
                </option>
              ))}
            </Select>
          )}

          <Button
            w="85%"
            size="lg"
            color="gray.900"
            bgGradient="linear(to-r, orange.400, yellow.400)"
            _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
          >
            Solicitar Agendamento
          </Button>

          {exibirAviso && (
            <Text
              mb={4}
              w="85%"
              color="red.900"
              fontSize="1xl"
              margin={4}
              border="2px solid"
              borderColor="red.500"
              bg="red.400"
              borderRadius="md"
              p={3}
            >
              Atenção! ⚠ <br />
              {textoAviso}
            </Text>
          )}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex minH="100vh" bg="barber.900" p={4}>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
        maxW="1800px"
        width="100%"
        mx="auto"
      >
        {/* Painel de Edição */}
        <Flex direction="column" bg="barber.400" borderRadius="xl" p={6}>
          <Heading
            fontSize="2xl"
            mb={6}
            bgGradient="linear(to-r, orange.400, yellow.400)"
            bgClip="text"
          >
            Editar Landing Page
          </Heading>

          <Tabs colorScheme="orange" variant="enclosed" size="sm">
            <TabList>
              <Tab fontSize="xs">Básico</Tab>
              <Tab fontSize="xs">Horários</Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Informações Básicas */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel color="white" fontSize="sm">
                      Título da Página
                    </FormLabel>
                    <Input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      bg="barber.900"
                      borderColor="gray.600"
                      color="white"
                      size="sm"
                      _hover={{ borderColor: "orange.400" }}
                    />
                  </FormControl>

                  <Divider my={2} />

                  <FormControl display="flex" alignItems="center">
                    <FormLabel color="white" mb={0} fontSize="sm" flex="1">
                      Exibir aviso de aprovação
                    </FormLabel>
                    <Switch
                      colorScheme="orange"
                      isChecked={exibirAviso}
                      onChange={(e) => setExibirAviso(e.target.checked)}
                    />
                  </FormControl>

                  {exibirAviso && (
                    <FormControl>
                      <FormLabel color="white" fontSize="sm">
                        Texto do Aviso
                      </FormLabel>
                      <Input
                        as="textarea"
                        value={textoAviso}
                        onChange={(e) => setTextoAviso(e.target.value)}
                        bg="barber.900"
                        borderColor="gray.600"
                        color="white"
                        size="sm"
                        _hover={{ borderColor: "orange.400" }}
                        rows={4}
                      />
                    </FormControl>
                  )}
                </VStack>
              </TabPanel>

              {/* Tab 2: Horários */}
              <TabPanel>
                <VStack spacing={3} align="stretch" maxH="500px" overflowY="auto">
                  <Text color="gray.300" fontSize="xs" mb={2}>
                    Configure os dias e horários de funcionamento
                  </Text>
                  {horarios.map((horario, index) => (
                    <Box
                      key={index}
                      p={3}
                      bg="barber.900"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={horario.ativo ? "green.500" : "gray.600"}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {horario.dia}
                        </Text>
                        <Switch
                          size="sm"
                          colorScheme="green"
                          isChecked={horario.ativo}
                          onChange={(e) =>
                            handleUpdateHorario(index, "ativo", e.target.checked)
                          }
                        />
                      </HStack>
                      {horario.ativo && (
                        <HStack spacing={2}>
                          <FormControl>
                            <FormLabel color="gray.400" fontSize="xs">
                              Abertura
                            </FormLabel>
                            <Input
                              type="time"
                              value={horario.inicio}
                              onChange={(e) =>
                                handleUpdateHorario(index, "inicio", e.target.value)
                              }
                              bg="gray.800"
                              borderColor="gray.600"
                              color="white"
                              size="xs"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="gray.400" fontSize="xs">
                              Fechamento
                            </FormLabel>
                            <Input
                              type="time"
                              value={horario.fim}
                              onChange={(e) =>
                                handleUpdateHorario(index, "fim", e.target.value)
                              }
                              bg="gray.800"
                              borderColor="gray.600"
                              color="white"
                              size="xs"
                            />
                          </FormControl>
                        </HStack>
                      )}
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Divider my={4} />

          <HStack justify="flex-end" spacing={3}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              color="gray.900"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              onClick={handleSalvar}
              isLoading={isLoading}
              loadingText="Salvando..."
            >
              Salvar Alterações
            </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={handleReset}
            >
                Resetar Página
            </Button>
          </HStack>
        </Flex>
        
        {/* Preview em Tempo Real */}
        <Box display={{ base: "none", lg: "block" }}>
          <PreviewLandingPage />
        </Box>
      </Grid>
    </Flex>
  );
}