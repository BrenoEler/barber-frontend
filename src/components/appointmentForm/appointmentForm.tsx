import { useState, useEffect, ChangeEvent } from "react";
import {
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Text,
  FormControl,
} from "@chakra-ui/react";
import Image from "next/image";
import { toast } from "sonner";
import Head from "next/head";
import { BusinessHoursChip } from "../businesshouschip";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

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

export function AgendamentoForm({ haircuts }: HaircutsProps) {
  const [nameClient, setNomeClient] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [datas, setData] = useState("");
  const [horario, setHorario] = useState("14:30");
  const [haircutsList, setHaircutsList] = useState<HaircutsItem[]>(
    haircuts || []
  );
  const [haircutId, setHaircutId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const api = setupAPIClient();

  // 🔹 Busca cortes disponíveis ao montar o componente
  useEffect(() => {
    async function loadHaircuts() {
      try {
        const response = await api.get("/haircuts", {
          params: { status: true },
        });
        setHaircutsList(response.data);
      } catch (err) {
        console.error("Erro ao carregar cortes:", err);
        toast.error("Erro ao carregar cortes disponíveis.");
      }
    }

    loadHaircuts();
  }, []);

  // 🔹 Função para formatar o celular em tempo real
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

  function handleChanger(e: ChangeEvent<HTMLInputElement>) {
    setCelular(formatarCelular(e.target.value));
  }

  async function handleSubmit() {
    try {
      const { data: userData } = await api.get("/me");
      const chatTelegram = userData?.telegramChatId;
      const userId = userData?.id;

      if (!nameClient || !celular || !datas || !horario || !haircutId) {
        toast.error("Todos os campos devem ser preenchidos.");
        return;
      }

      setIsLoading(true);

      await api.post("/appointments", {
        name: nameClient,
        email,
        celular,
        chatId: chatTelegram,
        data: datas,
        horario,
        userId,
        haircutId,
      });

      toast.success("Solicitação enviada com sucesso!");
      setNomeClient("");
      setEmail("");
      setCelular("");
      setData("");
      setHorario("14:30");
      setHaircutId("");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  const logoImg = "/images/logo.svg";

  const inputHover = {
    borderColor: "white",
    bg: "barber.900",
  };

  const inputBaseStyle = {
    borderColor: "barber.900",
    bg: "barber.400",
    w: "85%",
    size: "lg",
    _hover: inputHover,
    _focus: inputHover,
    mb: 3,
  };

  return (
    <>
      <Head>
        <title>Solicitar agendamento</title>
      </Head>

      <Flex
        minH="100vh"
        bg="barber.900"
        direction="column"
        align="center"
        justify="flex-start"
        p={4}
        gap="10"
      >
        <Heading
          fontSize="3xl"
          mt={4}
          mb={4}
          bgGradient="linear(to-b, orange.400, yellow.400)"
          bgClip="text"
          fontWeight="extrabold"
        >
          Agendamento
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
            align="center"
            justify="center"
          >
            <Image src={logoImg} alt="Logo" width={150} height={150} />
          </Flex>

          <Flex mb={4}>
            <BusinessHoursChip />
          </Flex>

          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Input
              type="text"
              placeholder="Nome"
              value={nameClient}
              onChange={(e) => setNomeClient(e.target.value)}
              {...inputBaseStyle}
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...inputBaseStyle}
            />
            <Input
              type="tel"
              placeholder="(27) 99999-9999"
              value={celular}
              onChange={handleChanger}
              {...inputBaseStyle}
            />
            <Input
              type="date"
              value={datas}
              onChange={(e) => setData(e.target.value)}
              {...inputBaseStyle}
            />
            <Input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              {...inputBaseStyle}
            />

            <Select
              width="85%"
              m="5px"
              value={haircutId}
              onChange={(e) => setHaircutId(e.target.value)}
            >
              <option value="" disabled>
                Selecione o corte
              </option>
              {haircutsList.map((haircut) => (
                <option key={haircut.id} value={haircut.id}>
                  {haircut.name}
                </option>
              ))}
            </Select>

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              onClick={handleSubmit}
              loadingText="Enviando..."
              isLoading={isLoading}
            >
              Solicitar Agendamento
            </Button>

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
              Seu agendamento não será aceito de imediato. O barbeiro terá que
              aprovar o agendamento. A devolutiva será enviada via WhatsApp.
            </Text>
          </FormControl>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: { status: true },
    });

    return {
      props: {
        haircuts: response.data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { haircuts: [] },
    };
  }
});
