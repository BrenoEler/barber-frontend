import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import { 
  Flex, 
  Heading, 
  Button, 
  Input, 
  Select, 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Icon,
  FormControl,
  FormLabel,
  useMediaQuery,
  Divider,
} from "@chakra-ui/react";
import { 
  FiUser, 
  FiScissors, 
  FiCalendar, 
  FiCheckCircle
} from "react-icons/fi";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface NewProps {
  haircuts: HaircutProps[];
}

export default function New({ haircuts }: NewProps) {
  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [email, setEmail] = useState("");
  const [contato, setContato] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const router = useRouter();

  async function buscarHorarios(data: string) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/schedule/times", { data });

      console.log("🔎 Retorno da API:", response.data);

      // Se for array direto
      if (Array.isArray(response.data)) {
        setHorariosDisponiveis(response.data);
      }
      // Se vier dentro de um objeto
      else if (
        response.data.horarios &&
        Array.isArray(response.data.horarios)
      ) {
        setHorariosDisponiveis(response.data.horarios);
      } else {
        setHorariosDisponiveis([]);
        console.warn("Formato inesperado de horários:", response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
    }
  }

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts.find((item) => item.id === id);
    if (haircutItem) setHaircutSelected(haircutItem);
  }

  function handleHorario(event: ChangeEvent<HTMLSelectElement>) {
    setHorarioSelecionado(event.target.value);
  }

  // Função para formatar o celular em tempo real
  function formatarCelular(valor: string) {
    // Remove tudo que não é dígito
    valor = valor.replace(/\D/g, "");
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    
    // Aplica a máscara conforme o tamanho
    if (valor.length > 10) {
      // Formato: (XX) XXXXX-XXXX
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      // Formato: (XX) XXXX-XXXX
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      // Formato: (XX) XXXX
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (valor.length > 0) {
      // Formato: (XX
      valor = valor.replace(/^(\d*)/, "($1");
    }
    
    return valor;
  }

  // Função para validar o celular
  function validarCelular(celular: string): boolean {
    // Remove formatação
    const apenasDigitos = celular.replace(/\D/g, "");
    // Valida se tem 10 ou 11 dígitos (com ou sem o 9)
    return apenasDigitos.length === 10 || apenasDigitos.length === 11;
  }

  function handleContatoChange(e: ChangeEvent<HTMLInputElement>) {
    const valorFormatado = formatarCelular(e.target.value);
    setContato(valorFormatado);
  }

  async function handleRegister() {
    if (customer === "" || !dataAgendamento || !horarioSelecionado) {
      toast.error("Preencha nome, data e horário.");
      return;
    }

    setIsLoading(true);
    try {
      const apiClient = setupAPIClient();

      // Monta ISO 8601 para o backend (ex.: 2025-09-23T15:00:00.000Z)
      const dataIso = new Date(
        `${dataAgendamento}T${horarioSelecionado}:00`
      ).toISOString();

      await apiClient.post("/schedule", {
        customer,
        haircut_id: haircutSelected?.id,
        clientCelular: contato,
        clientEmail: email,
        dataHora: dataIso,
      });

      toast.success("Agendamento registrado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      console.log("Erro ao registrar:", err);
      toast.error("Erro ao registrar!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>BarberPro - Novo agendamento</title>
      </Head>
      <Sidebar>
        <Flex 
          direction="column" 
          align="flex-start" 
          justify="flex-start"
          w="100%"
          maxW="900px"
          p={isMobile ? 4 : 6}
        >
          <HStack spacing={3} mb={6}>
            <Icon as={FiCalendar} boxSize={8} color="button.cta" />
            <Heading fontSize="3xl" color="whiteAlpha.900">
              Novo Agendamento
            </Heading>
          </HStack>

          <Box
            w="100%"
            bg="barber.400"
            borderRadius="xl"
            p={isMobile ? 4 : 8}
            shadow="lg"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <VStack spacing={6} align="stretch">
              {/* Informações do Cliente */}
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={FiUser} color="button.cta" />
                  <Text fontSize="lg" fontWeight="semibold" color="whiteAlpha.900">
                    Informações do Cliente
                  </Text>
                </HStack>
                <Divider borderColor="whiteAlpha.200" mb={4} />
                
                <FormControl mb={4}>
                  <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                    Nome do Cliente *
                  </FormLabel>
                  <Input
                    placeholder="Digite o nome completo"
                    size="lg"
                    bg="barber.900"
                    color="whiteAlpha.900"
                    borderColor="whiteAlpha.200"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    _hover={{ borderColor: "button.cta" }}
                    _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                  />
                </FormControl>

                <HStack spacing={4} flexDirection={isMobile ? "column" : "row"}>
                  <FormControl flex={1} mb={isMobile ? 4 : 0} isInvalid={contato !== "" && !validarCelular(contato)}>
                    <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                      Contato
                    </FormLabel>
                    <Input
                      placeholder="(27) 99999-9999"
                      size="lg"
                      bg="barber.900"
                      color="whiteAlpha.900"
                      borderColor={contato !== "" && !validarCelular(contato) ? "red.400" : "whiteAlpha.200"}
                      type="tel"
                      value={contato}
                      onChange={handleContatoChange}
                      maxLength={15}
                      _hover={{ borderColor: contato !== "" && !validarCelular(contato) ? "red.400" : "button.cta" }}
                      _focus={{ 
                        borderColor: contato !== "" && !validarCelular(contato) ? "red.400" : "button.cta", 
                        boxShadow: contato !== "" && !validarCelular(contato) ? "0 0 0 1px red.400" : "0 0 0 1px button.cta"
                      }}
                    />
                    {contato !== "" && !validarCelular(contato) && (
                      <Text fontSize="xs" color="red.400" mt={1}>
                        Digite um telefone válido (10 ou 11 dígitos)
                      </Text>
                    )}
                    {contato !== "" && validarCelular(contato) && (
                      <Text fontSize="xs" color="green.400" mt={1}>
                        ✓ Telefone válido
                      </Text>
                    )}
                  </FormControl>

                  <FormControl flex={1}>
                    <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                      E-mail
                    </FormLabel>
                    <Input
                      placeholder="cliente@email.com"
                      size="lg"
                      bg="barber.900"
                      color="whiteAlpha.900"
                      borderColor="whiteAlpha.200"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      _hover={{ borderColor: "button.cta" }}
                      _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                    />
                  </FormControl>
                </HStack>
              </Box>

              {/* Serviço e Agendamento */}
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={FiScissors} color="button.cta" />
                  <Text fontSize="lg" fontWeight="semibold" color="whiteAlpha.900">
                    Serviço e Agendamento
                  </Text>
                </HStack>
                <Divider borderColor="whiteAlpha.200" mb={4} />

                <FormControl mb={4}>
                  <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                    Tipo de Corte *
                  </FormLabel>
                  <Select
                    bg="barber.900"
                    color="whiteAlpha.900"
                    borderColor="whiteAlpha.200"
                    size="lg"
                    value={haircutSelected?.id}
                    onChange={(e) => handleChangeSelect(e.target.value)}
                    _hover={{ borderColor: "button.cta" }}
                    _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                  >
                    {haircuts?.map((item) => (
                      <option
                        style={{ backgroundColor: "#1a202c", color: "#fff" }}
                        key={item.id}
                        value={item.id}
                      >
                        {item.name} - R$ {item.price}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <HStack spacing={4} flexDirection={isMobile ? "column" : "row"}>
                  <FormControl flex={1} mb={isMobile ? 4 : 0}>
                    <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                      Data *
                    </FormLabel>
                    <Input
                      type="date"
                      size="lg"
                      bg="barber.900"
                      color="whiteAlpha.900"
                      borderColor="whiteAlpha.200"
                      value={dataAgendamento}
                      onChange={(e) => {
                        setDataAgendamento(e.target.value);
                        buscarHorarios(e.target.value);
                      }}
                      _hover={{ borderColor: "button.cta" }}
                      _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                    />
                  </FormControl>

                  <FormControl flex={1}>
                    <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                      Horário *
                    </FormLabel>
                    <Select
                      bg="barber.900"
                      color="whiteAlpha.900"
                      borderColor="whiteAlpha.200"
                      size="lg"
                      value={horarioSelecionado}
                      onChange={handleHorario}
                      placeholder="Selecione um horário"
                      isDisabled={!dataAgendamento || horariosDisponiveis.length === 0}
                      _hover={{ borderColor: "button.cta" }}
                      _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                    >
                      {horariosDisponiveis.map((hora) => (
                        <option
                          style={{ backgroundColor: "#1a202c", color: "#fff" }}
                          key={hora}
                          value={hora}
                        >
                          {hora}
                        </option>
                      ))}
                    </Select>
                    {!dataAgendamento && (
                      <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                        Selecione uma data primeiro
                      </Text>
                    )}
                  </FormControl>
                </HStack>
              </Box>

              <Divider borderColor="whiteAlpha.200" />

              <Button
                w="100%"
                size="lg"
                color="gray.900"
                bgGradient="linear(to-r, button.cta, #FFb13e)"
                _hover={{ 
                  bgGradient: "linear(to-r, #FFb13e, button.cta)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                onClick={handleRegister}
                loadingText="Cadastrando..."
                isLoading={isLoading}
                leftIcon={<Icon as={FiCheckCircle} />}
                fontWeight="bold"
                transition="all 0.2s"
              >
                Confirmar Agendamento
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/haircuts", {
    params: { status: true },
  });

  return {
    props: { haircuts: response.data ?? [] },
  };
});
