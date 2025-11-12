import { useState } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
  Box,
  Divider,
  useColorModeValue,
  Icon,
  Badge,
  VStack,
} from "@chakra-ui/react";

import { FiScissors, FiCalendar, FiDollarSign } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { FaTelegram, FaMobileAlt } from "react-icons/fa";

import Link from "next/link";
import { Sidebar } from "../../components/sidebar";
import { ModalInfo } from "../../components/modal";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

export interface ScheduleItem {
  id: string;
  customer: string;
  // Datas/horários
  dataHora?: string; // ex: "2025-09-24 14:00:00" ou "2025-09-24T14:00:00Z"
  date?: string; // ex: "2025-09-24"
  time?: string; // ex: "14:00"
  horario?: string; // ex: "14:00"
  data?: string; // ex: "2025-09-24"
  scheduled_at?: string; // ex: ISO string
  status?: string;
  source: string;
  haircut: {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
  };
}

export interface TelegramScheduleItem extends ScheduleItem {
  customerName: string;
  scheduledAt: Date;
}

interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  const [list, setList] = useState(schedule);
  const [service, setService] = useState<ScheduleItem>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const cardBg = useColorModeValue("barber.400", "gray.800");
  const hoverBg = useColorModeValue("whiteAlpha.300", "gray.700");
  const borderColor = useColorModeValue("whiteAlpha.300", "gray.600");

  function handleOpenModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  function getDateTime(item: ScheduleItem) {
    const dateStr = item.date || item.data;
    const timeStr = item.time || item.horario;
    const combined =
      item.dataHora ||
      item.scheduled_at ||
      (dateStr && timeStr ? `${dateStr} ${timeStr}` : undefined);

    if (!combined && !dateStr && !timeStr) {
      return { displayDate: "", displayTime: "" };
    }

    if (dateStr && timeStr && !item.dataHora && !item.scheduled_at) {
      return {
        displayDate: formatDate(dateStr),
        displayTime: formatTime(timeStr),
      };
    }

    const dateObj = parseDate(combined as string);
    if (!dateObj) {
      return {
        displayDate: dateStr ? formatDate(dateStr) : "",
        displayTime: timeStr ? formatTime(timeStr) : "",
      };
    }

    return {
      displayDate: dateObj.toLocaleDateString("pt-BR"),
      displayTime: dateObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  function parseDate(input: string | undefined) {
    if (!input) return undefined;
    const normalized =
      input.includes(" ") && !input.includes("T")
        ? input.replace(" ", "T")
        : input;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? undefined : d;
  }

  function formatDate(d: string) {
    const parts = d.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    const dateObj = parseDate(d);
    return dateObj ? dateObj.toLocaleDateString("pt-BR") : d;
  }

  function formatTime(t: string) {
    const [hh, mm] = t.split(":");
    return hh && mm ? `${hh}:${mm}` : t;
  }

  async function handleFinish(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/schedule", { schedule_id: id, status: "inactive" });
      const updated = list.filter((item) => item.id !== id);
      setList(updated);
      onClose();
    } catch (err) {
      console.log(err);
      onClose();
      import("sonner").then(({ toast }) =>
        toast.error("Erro ao finalizar este serviço")
      );
    }
  }

  async function handleDelete(scheduleId: string) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.delete("/schedule/delete", { data: { id: scheduleId } });

      setList(prev => prev.filter(item => item.id !== scheduleId));

      import("sonner").then(({ toast }) => toast.success("Agendamento deletado!"));
    } catch (err) {
      console.log("Erro ao deletar:", err);
      import("sonner").then(({ toast }) =>
        toast.error("Erro ao deletar agendamento.")
      );
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Agenda</title>
      </Head>

      <Sidebar>
        <Flex direction="column" w="100%" p={isMobile ? 2 : 6}>
          {/* Cabeçalho */}
          <Flex
            w="100%"
            align="center"
            justify="space-between"
            flexWrap="wrap"
            mb={6}
          >
            <Heading fontSize="3xl" color="whiteAlpha.900">
              Agendamentos
            </Heading>
            <Button
              as={Link}
              href="/new"
              bgGradient="linear(to-r, orange.400, yellow.400)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, orange.500, yellow.500)" }}
              shadow="md"
              px={6}
              mt={isMobile ? 3 : 0}
            >
              + Novo Agendamento
            </Button>
          </Flex>

          <Divider borderColor={borderColor} mb={4} />

          {/* Lista */}
          {list.length === 0 ? (
            <Text color="whiteAlpha.700" textAlign="center" mt={10}>
              Nenhum agendamento ativo no momento.
            </Text>
          ) : (
            list.map((item) => {
              const { displayDate, displayTime } = getDateTime(item);

              return (
                <ChakraLink
                  key={item.id}
                  onClick={() => handleOpenModal(item)}
                  _hover={{ textDecoration: "none" }}
                >
                  <Flex
                  key={item.id}
                  bg={cardBg}
                  _hover={{ bg: hoverBg }}
                  transition="0.2s"
                  rounded="xl"
                  shadow="sm"
                  p={isMobile ? 4 : 5}
                  mb={3}
                  border="1px solid"
                  borderColor={borderColor}
                  direction={isMobile ? "column" : "row"}
                  align="center"
                  justify="space-between"
                  gap={isMobile ? 4 : 8}
                >
                  {/* Cliente + Origem */}
                  <Flex align="center" gap={3}>
                    <Icon as={IoMdPerson} boxSize={6} color="orange.300" />
                    <Text fontWeight="bold" fontSize="lg" color="whiteAlpha.900">
                      {item.customer}
                    </Text>
                    <Box>
                      {item.source === "telegram" ? (
                        <FaTelegram size={22} color="#0088cc" />
                      ) : (
                        <FaMobileAlt size={20} color="#f1f1f1" />
                      )}
                    </Box>
                  </Flex>

                  {/* Corte, Preço e Horário separados */}
                  <VStack spacing={2} align={isMobile ? "center" : "flex-start"} color="whiteAlpha.800">
                    <Flex align="center" gap={2}>
                      <Icon as={FiScissors} color="orange.300" />
                      <Text fontWeight="bold">{item.haircut.name}</Text>
                    </Flex>

                    <Flex align="center" gap={2}>
                      <Icon as={FiDollarSign} color="green.400" />
                      <Text fontWeight="bold">R$ {item.haircut.price}</Text>
                    </Flex>

                    {(displayDate || displayTime) && (
                      <Flex align="center" gap={2}>
                        <Icon as={FiCalendar} color="orange.300" />
                        <Text fontWeight="bold">
                          {displayDate} {displayTime && `• ${displayTime}`}
                        </Text>
                      </Flex>
                    )}
                    {/* Botão de deletar */}
                    <Flex align="center" justify="flex-end" gap={2} w="100%">
                        <Button
                          size="sm"
                          colorScheme="red"
                          display="block"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Tem certeza que quer deletar este agendamento?")) {
                              handleDelete(item.id); 
                            }
                          }}
                        >
                          Deletar
                        </Button>
                      </Flex>
                    </VStack>
                  </Flex>
                </ChakraLink>
              );
            })
          )}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => service?.id && handleFinish(service.id)}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const [response, telegramResponse] = await Promise.all([
      apiClient.get("/schedule"),
      apiClient.get("/telegramlist"),
    ]);

    // Filtrar schedules no servidor para otimizar performance
    // Apenas schedules com status 'active' serão enviados para o cliente
    const activeSchedules = response.data.filter(
      (item: ScheduleItem) => item.status === "active"
    );

    const activeTelegram = telegramResponse.data.filter(
      (item: TelegramScheduleItem) => item.status === "accepted"
    );

    const normalizedApp: ScheduleItem[] = activeSchedules.map((item: ScheduleItem) => ({
      id: item.id,
      customer: item.customer || "Cliente",
      haircut: {
        id: item.haircut?.id,
        name: item.haircut?.name,
        price: item.haircut?.price,
      },
      scheduled_at: item.dataHora,
      status: item.status,
      source: "app",
    }));

    const normalizedTelegram: TelegramScheduleItem[] = activeTelegram.map((item: TelegramScheduleItem) => ({
      id: item.id,
      customer: item.customerName || "Cliente Telegram",
      haircut: {
        id: "telegram",
        name: item.haircut?.name,
        price: item.haircut?.price,
      },
      scheduled_at: item.scheduledAt,
      status: item.status,
      source: "telegram",
    }));

    const unified: ScheduleItem[] = [...normalizedApp, ...normalizedTelegram].sort(
      (a, b) => 
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    );
    
    return {
      props: {
        schedule: unified,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        schedule: [],
      },
    };
  }
});
