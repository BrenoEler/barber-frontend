import { useState, useEffect, ChangeEvent } from "react";
import {
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { toast } from "sonner";
import Head from "next/head";
import { BusinessHoursChip } from "../businesshouschip";

export function AgendamentoForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [chatId, setChatId] = useState("1992351796");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("14:30");
  const [userId, setUserId] = useState("");
  const [haircuts, setHaircuts] = useState([]);
  const [haircutId, setHaircutId] = useState<string>(
    "3954661d-a2ec-427f-a3eb-5404f6c97ca6"
  );

  const [loadingCuts, setLoadingCuts] = useState(false);
  const [cutsError, setCutsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  function formatarCelular(valor: string) {
    valor = valor.replace(/\D/g, "");
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2}) (\d{0,5})/, "($1) $2");
    } else {
      valor = valor.replace(/^(\d*)/, "$1");
    }
    return valor;
  }

  function handerChanger(e: ChangeEvent<HTMLInputElement>) {
    setCelular(formatarCelular(e.target.value));
  }

  useEffect(() => {
    async function fetchCuts() {
      setLoadingCuts(true);
      setCutsError(null);
      try {
        const url = new URL("/haircuts", apiBase);
        url.searchParams.set("status", "true");
        const res = await fetch(url.toString());
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((i: any) => ({ id: i.id, name: i.name }));
        const hasSelected = mapped.some((i: any) => i.id === haircutId);
        const finalList =
          hasSelected || !haircutId
            ? mapped
            : [{ id: haircutId, name: "Corte selecionado" }, ...mapped];
        setHaircuts(finalList);
        if ((!haircutId || String(haircutId).trim() === "") && finalList.length > 0) {
          setHaircutId(finalList[0].id);
        }
      } catch (e) {
        setCutsError("Não foi possível carregar os cortes.");
        setHaircuts([]);
      } finally {
        setLoadingCuts(false);
      }
    }
    fetchCuts();
  }, []);

  async function handleSubmit() {
    if (String(haircutId).trim() === "" && haircuts.length > 0) {
      setHaircutId(haircuts[0].id);
    }

    const missing: string[] = [];
    if (String(chatId).trim() === "") missing.push("chatId");
    if (nome.trim() === "") missing.push("nome");
    if (email.trim() === "") missing.push("email");
    if (celular.trim() === "") missing.push("telefone");
    if (data.trim() === "") missing.push("data");
    if (horario.trim() === "") missing.push("horário");
    if (userId.trim() === "") missing.push("user_id");
    if (String(haircutId).trim() === "") missing.push("haircutId");

    if (missing.length > 0) {
      toast.error(`Preencha: ${missing.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const dataIso = new Date(`${data}T${horario}:00`).toISOString();

      const res = await fetch(`${apiBase}/simular-agendamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: Number(chatId),
          nameClient: nome,
          customerContact: celular,
          customerEmail: email,
          scheculeDateTime: dataIso,
          user_id: userId,
          haircutId: haircutId,
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success("Solicitação enviada!");
      setNome("");
      setEmail("");
      setCelular("");
      setChatId("");
      setData("");
      setHorario("");
      setHaircutId("");
    } catch (err) {
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
          <Flex w="50" h="50" pb={6} rounded="full" align="center" justify="center">
            <Image src={logoImg} alt="Logo" width={150} height={150} />
          </Flex>

          <Flex mb={4}>
            <BusinessHoursChip />
          </Flex>

          <Input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            onChange={handerChanger}
            {...inputBaseStyle}
          />

          <Input
            type="date"
            value={data}
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
            color="white"
            value={haircutId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setHaircutId(e.target.value)
            }
            isDisabled={loadingCuts}
            placeholder={
              loadingCuts ? "Carregando cortes..." : "Selecione um corte"
            }
            {...inputBaseStyle}
          >
            {cutsError && (
              <option style={{ backgroundColor: "#FFF", color: "#000" }}>
                {cutsError}
              </option>
            )}
            {!cutsError &&
              haircuts.map((h) => (
                <option
                  key={h.id}
                  value={h.id}
                  style={{ backgroundColor: "#FFF", color: "#000" }}
                >
                  {h.name}
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
        </Flex>
      </Flex>
    </>
  );
}
