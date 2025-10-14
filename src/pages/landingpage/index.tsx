import { useState, ChangeEvent, useEffect } from "react";
import Head from "next/head";
import {
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Text,
  Avatar,
} from "@chakra-ui/react";
// Página pública: não usa Sidebar autenticado
import { toast } from "sonner";
import Image from "next/image";
import { useColorModeValue } from "@chakra-ui/react";
import { BusinessHoursChip } from "../../components/businesshouschip";

export default function SimularAgendamento() {
  // Valores estáticos solicitados
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

  function handerChanger(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;

    setCelular(formatarCelular(valor));
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
        if (
          (!haircutId || String(haircutId).trim() === "") &&
          finalList.length > 0
        ) {
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
    // Fallback: se haircutId vazio mas há itens, seleciona o primeiro
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
      console.log("Campos faltando:", {
        chatId,
        nome,
        email,
        celular,
        data,
        horario,
        userId,
        haircutId,
      });
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

      toast.success("Solicitação enviada! Aguardando aprovação do barbeiro.");
      setNome("");
      setEmail("");
      setCelular("");
      setChatId("");
      setData("");
      setHorario("");
      setHaircutId("");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  const logoImg = "/images/logo.svg";

  function formatarCelular(valor: string) {
    //Faz a remoção de tudo que não for número
    valor = valor.replace(/\D/g, "");
    //Aplica formatação
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

  console.log(formatarCelular("27981235799"));

    const cardBg = useColorModeValue("barber.400", "gray.800");
    const hoverBg = useColorModeValue("whiteAlpha.300", "gray.700");
    const borderColor = useColorModeValue("whiteAlpha.300", "gray.600");

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
            alignItems="center"
            justifyContent="center"
          >
            <Image src={logoImg} alt="Logo" width={150} height={150} />
          </Flex>
          <Flex margin="5">
            <BusinessHoursChip />
          </Flex>
          <Input
            type="text"
            mt={4}
            mb={3}
            placeholder="Nome"
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            w="85%"
            size="lg"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            isRequired={true}
          />
          <Input
            type="email"
            mb={3}
            placeholder="E-mail"
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            w="85%"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired={true}
          />
          <Input
            placeholder="(27) 99999-9999"
            w="85%"
            mb={3}
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            size="lg"
            type="tel"
            value={celular}
            onChange={handerChanger}
          />
          <Input
            type="date"
            w="85%"
            mb={3}
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            size="lg"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <Input
            type="time"
            w="85%"
            mb={3}
            size="lg"
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
          <Select
            color="white"
            mb={3}
            _hover={{
            borderColor: "white",
            bg: "barber.900"}}
            _focus={{ 
            borderColor: "white",
            bg: "barber.900"}}
            borderColor="barber.900"
            bg="barber.400"
            size="lg"
            w="85%"
            placeholder={
              loadingCuts ? "Carregando cortes..." : "Selecione um corte"
            }
            value={haircutId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setHaircutId(e.target.value)
            }
            isDisabled={loadingCuts}
          >
            {cutsError && (
              <option
                value=""
                style={{ backgroundColor: "#FFF", color: "#000" }}
              >
                {cutsError}
              </option>
            )}
            {!cutsError && !loadingCuts && haircuts.length === 0 && (
              <option
                value=""
                style={{ backgroundColor: "#FFF", color: "#000" }}
              >
                Nenhum corte disponível
              </option>
            )}
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
          Atenção! ⚠ <br></br> Seu agendamento não será aceito de imediato, o barbeiro terá
          que aprovar o agendamento. Caso aprovado ou reprovado, a devolutiva
          será enviada via WhatsApp.
        </Text>
        </Flex>
      </Flex>
    </>
  );
}
