import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from "../../../public/images/logo.svg";
import { 
  Flex, 
  Text, 
  Center, 
  Input, 
  Button, 
  Box, 
  VStack, 
  Heading,
  FormControl,
  FormLabel,
  Icon,
  useMediaQuery,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { toast } from "sonner";

import Link from "next/link";

import { AuthContext } from "../../context/AuthContext";
import { canSSRGuest } from "../../utils/canSSRGuest";

export default function Register() {
  const { signUp } = useContext(AuthContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (name === "" || email === "" || password === "") {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    await signUp({
      name,
      email,
      password,
    });
    setIsLoading(false);
  }

  return (
    <>
      <Head>
        <title>Cria sua conta no BarberPRO</title>
      </Head>
      <Flex
        background="barber.900"
        minH="100vh"
        alignItems="center"
        justifyContent="center"
        p={4}
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.03}
          backgroundImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
          backgroundSize="40px 40px"
        />

        <Box
          width={isMobile ? "100%" : "500px"}
          maxW="500px"
          bg="barber.400"
          borderRadius="2xl"
          p={isMobile ? 8 : 10}
          shadow="2xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
          position="relative"
          zIndex={1}
        >
          <VStack spacing={8} align="stretch">
            {/* Logo */}
            <Center>
              <Box mb={4}>
                <Image
                  src={logoImg}
                  quality={100}
                  width={180}
                  height={180}
                  alt="Logo barberpro"
                  style={{ borderRadius: "50%" }}
                />
              </Box>
            </Center>

            <VStack spacing={2} mb={6}>
              <Heading
                fontSize="2xl"
                bgGradient="linear(to-r, orange.400, yellow.400)"
                bgClip="text"
                fontWeight="extrabold"
              >
                Crie sua conta
              </Heading>
              <Text color="whiteAlpha.700" fontSize="sm">
                Comece a gerenciar sua barbearia hoje
              </Text>
            </VStack>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                  Nome da Barbearia *
                </FormLabel>
                <Input
                  placeholder="Ex: Barbearia do João"
                  type="text"
                  size="lg"
                  bg="barber.900"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  _hover={{ borderColor: "button.cta" }}
                  _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                  E-mail *
                </FormLabel>
                <Input
                  placeholder="seu@email.com"
                  type="email"
                  size="lg"
                  bg="barber.900"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  _hover={{ borderColor: "button.cta" }}
                  _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="whiteAlpha.700" fontSize="sm" fontWeight="medium">
                  Senha *
                </FormLabel>
                <Input
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  size="lg"
                  bg="barber.900"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  _hover={{ borderColor: "button.cta" }}
                  _focus={{ borderColor: "button.cta", boxShadow: "0 0 0 1px button.cta" }}
                />
                <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                  Mínimo de 6 caracteres
                </Text>
              </FormControl>
            </VStack>

            <Button
              onClick={handleRegister}
              bgGradient="linear(to-r, button.cta, #FFb13e)"
              color="gray.900"
              size="lg"
              _hover={{
                bgGradient: "linear(to-r, #FFb13e, button.cta)",
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
              loadingText="Cadastrando..."
              isLoading={isLoading}
              leftIcon={<Icon as={FiUserPlus} />}
              fontWeight="bold"
              transition="all 0.2s"
            >
              Criar Conta
            </Button>

            <Center mt={4}>
              <Text color="whiteAlpha.700" fontSize="sm">
                Já possui uma conta?{" "}
                <Link href="/login" prefetch={false}>
                  <Text as="span" color="button.cta" fontWeight="bold" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                    Faça login
                  </Text>
                </Link>
              </Text>
            </Center>
          </VStack>
        </Box>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
