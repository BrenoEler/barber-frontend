import {
  Flex,
  Text,
  Heading,
  Button,
  Divider,
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  useDisclosure,
} from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import { IoIosAdd } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { CreateUserModal } from "../../components/cliente-edit-modal";
import { useState } from "react";
import { ExampleDrawer } from "../../components/drawer";
import { on } from "events";
interface Clientes {
  id: number;
  name: string;
  celular: string;
  email: string;
  endereco: string;
}

export default function Clientes() {
  const clientes: Clientes[] = [
    {
      id: 1,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 2,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 3,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 4,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 5,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 6,
      name: "Ronaldo",
      celular: "27999999999",
      email: "Qr1b8@example.com",
      endereco: "Rua 1",
    },
    {
      id: 7,
      name: "Ronaldo",
      celular: "27999999999",
      email: "teste@teste.com",
      endereco: "Rua 1",
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelectedClient] = useState<Clientes | null>(null);

  const handleEdit = (cliente: Clientes) => {
    setSelectedClient(cliente);
    onOpen();
  };

  const handleDelete = (cliente: Clientes) => {
    setSelectedClient(cliente);
    onOpen();
  };

  const handleSaveUser = (cliente: Clientes) => {
    console.log("Usuário atualizado:", cliente);
    onClose();

    // await api.put(`/users/${updatedUser.id}`, updatedUser);
  };

  const handleRowClick = (cliente: Clientes) => {
    setSelectedClient(cliente);
    onOpen();
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    console.log("Filtros aplicados:", filters);
  };

  return (
    <Sidebar>
      <Heading>
        <title>Clientes - Minha barbearia</title>
      </Heading>
      <Flex>
        <Flex direction="row" justify="space-between" w="100%">
          <Text fontSize="3xl" p={4} fontWeight="bold">
            Clientes
          </Text>
          <Flex p={4} border={{ 1: "1px solid #FFF" }} rounded={"full"} gap={2}>
            <Button
              onClick={onOpen}
              background="transparent"
              color="#FFF"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              shadow="md"
              px={6}
            >
              <IoIosAdd size={30} />
            </Button>
            <Button
              onClick={onOpen}
              background="transparent"
              color="#FFF"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              shadow="md"
            >
              <CiFilter size={30} />
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Divider mb={8} />

      {/*Section clientes*/}
      <Flex>
        <TableContainer border="1px solid #FFF" borderRadius="md" w={"100%"}>
          <Table variant="simple">
            <Thead bg="barber.400" color="#FFF">
              <Tr gap="1px">
                <Th color="#FFF">ID</Th>
                <Th color="#FFF">Nome</Th>
                <Th color="#FFF">Celular</Th>
                <Th color="#FFF">Email</Th>
                <Th color="#FFF">Endereço</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientes.map((c) => (
                <Tr
                  key={c.id}
                  _hover={{ bg: "barber.400" }}
                  cursor={"pointer"}
                  onClick={() => handleRowClick(c)}
                >
                  <Th color="#fff">{c.id}</Th>
                  <Th color="#fff">{c.name}</Th>
                  <Th color="#fff">{c.celular}</Th>
                  <Th color="#fff">{c.email}</Th>
                  <Th color="#fff">{c.endereco}</Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <CreateUserModal isOpen={isOpen} onClose={onClose} cliente={selected} />
      </Flex>

      <Box>
        <CreateUserModal isOpen={isOpen} onClose={onClose} />
      </Box>
      <Box>
        {/* <ExampleDrawer
          isOpen={isOpen}
          onClose={onClose}
          onAply={handleAplyFilter}
        /> */}
      </Box>
    </Sidebar>
  );
}
