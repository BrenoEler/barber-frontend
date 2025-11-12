import { useState, useEffect, ChangeEvent } from "react";
import {
  Flex,
  Heading,
  Button,
  Input,
  Select,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Head from "next/head";
import { BusinessHoursChip } from "../businesshouschip";

export default function LandingPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [chatId, setChatId] = useState("1992351796");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("14:30");
  const [userId, setUserId] = useState("");
  const [haircuts, setHaircuts] = useState([]);
  const [logo, setLogo] = useState("/images/logo.svg");
  const [haircutId, setHaircutId] = useState<string>("");
  const [loadingCuts, setLoadingCuts] = useState(false);
  const [cutsError, setCutsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redes sociais
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  // 📱 Formata o número de celular
  function formatarCelular(valor: string) {
    valor = valor.replace(/\D/g, "");
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    }
    return valor;
  }

  function handerChanger(e: ChangeEvent<HTMLInputElement>) {
    setCelular(formatarCelular(e.target.value));
  }

  // Busca cortes e dados da landing
  useEffect(() => {
    async function fetchCuts() {
      setLoadingCuts(true);
      try {
        const url = new URL("/haircuts", apiBase);
        url.searchParams.set("status", "true");
        const res = await fetch(url.toString());
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((i: any) => ({ id: i.id, name: i.name }));
        setHaircuts(mapped);
        if (!haircutId && mapped.length > 0) {
          setHaircutId(mapped[0].id);
        }
      } catch {
        setCutsError("Não foi possível carregar os cortes.");
        setHaircuts([]);
      } finally {
        setLoadingCuts(false);
      }
    }
    
    fetchCuts();
  }, [apiBase, haircutId]);

  // Envia o formulário
  async function handleSubmit() {
    const missing: string[] = [];
    if (!chatId) missing.push("chatId");
    if (!nome) missing.push("nome");
    if (!email) missing.push("email");
    if (!celular) missing.push("telefone");
    if (!data) missing.push("data");
    if (!horario) missing.push("horário");
    if (!haircutId) missing.push("haircutId");

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

      if (!res.ok) throw new Error("Falha no envio");

      toast.success("Solicitação enviada!");
      setNome("");
      setEmail("");
      setCelular("");
      setData("");
      setHorario("");
      setHaircutId("");
    } catch {
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputHover = {
    borderColor: "white",
    bg: "barber.900",
  };

  const inputBaseStyle = {
    borderColor: "barber.900",
    bg: "barber.400",
    w: "85%",
    size: "lg" as const,
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
            <Image src={logo} alt="Logo" width={150} height={150} />
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
            Seu agendamento não será aceito de imediato. O barbeiro precisa aprovar o
            agendamento. A devolutiva será enviada via WhatsApp.
          </Text>

          <Flex
            mt={6}
            gap={4}
            justify="center"
            align="center"
            w="85%"
            flexWrap="wrap"
          >
            {whatsapp && (
              <Link
                href={
                  whatsapp.startsWith("http")
                    ? whatsapp
                    : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton
                  aria-label="WhatsApp"
                  icon={<FaWhatsapp />}
                  size="lg"
                  colorScheme="green"
                  borderRadius="full"
                  variant="solid"
                  _hover={{ transform: "scale(1.1)" }}
                />
              </Link>
            )}

            {instagram && (
              <Link
                href={
                  instagram.startsWith("http")
                    ? instagram
                    : `https://instagram.com/${instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  size="lg"
                  colorScheme="pink"
                  borderRadius="full"
                  variant="solid"
                  _hover={{ transform: "scale(1.1)" }}
                />
              </Link>
            )}

            {facebook && (
              <Link
                href={
                  facebook.startsWith("http")
                    ? facebook
                    : `https://facebook.com/${facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton
                  aria-label="Facebook"
                  icon={<FaFacebook />}
                  size="lg"
                  colorScheme="blue"
                  borderRadius="full"
                  variant="solid"
                  _hover={{ transform: "scale(1.1)" }}
                />
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
