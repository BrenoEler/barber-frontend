import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useMemo, useState } from 'react';

import { FaMobileAlt, FaTelegram } from 'react-icons/fa';
import {
  FiBell,
  FiCalendar,
  FiDollarSign,
  FiScissors,
  FiSearch,
} from 'react-icons/fi';

import { IoMdPerson } from 'react-icons/io';

import { RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { ModalInfo } from '../../components/modal';
import { Sidebar } from '../../components/sidebar';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
export interface ScheduleItem {
  id: string;
  customer: string;
  dataHora?: string;
  date?: string;
  time?: string;
  horario?: string;
  data?: string;
  scheduled_at?: string;
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
  newAppointmentsCount: number;
}

export default function Dashboard({
  schedule,
  newAppointmentsCount,
}: DashboardProps) {
  const [list, setList] = useState(schedule);
  const [service, setService] = useState<ScheduleItem>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [newCount, setNewCount] = useState(newAppointmentsCount);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [filterSource, setFilterSource] = useState<'all' | 'app' | 'telegram'>(
    'all',
  );

  const cardBg = useColorModeValue('barber.400', 'gray.800');
  const hoverBg = useColorModeValue('whiteAlpha.300', 'gray.700');
  const borderColor = useColorModeValue('black', 'gray.600');

  // Filtrar e ordenar lista
  const filteredList = useMemo(() => {
    let filtered = [...list];

    // Filtro por fonte
    if (filterSource !== 'all') {
      filtered = filtered.filter((item) => item.source === filterSource);
    }

    // Pesquisa por nome do cliente
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.customer.localeCompare(b.customer);
      }
      if (sortBy === 'price') {
        const priceA = Number(a.haircut?.price || 0);
        const priceB = Number(b.haircut?.price || 0);
        return priceB - priceA;
      }
      // Ordenação por data (padrão)
      const dateA = parseDate(a.dataHora || a.scheduled_at);
      const dateB = parseDate(b.dataHora || b.scheduled_at);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [list, searchTerm, sortBy, filterSource]);

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
      return { displayDate: '', displayTime: '' };
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
        displayDate: dateStr ? formatDate(dateStr) : '',
        displayTime: timeStr ? formatTime(timeStr) : '',
      };
    }

    return {
      displayDate: dateObj.toLocaleDateString('pt-BR'),
      displayTime: dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  function parseDate(input: string | undefined) {
    if (!input) return undefined;
    const normalized =
      input.includes(' ') && !input.includes('T')
        ? input.replace(' ', 'T')
        : input;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? undefined : d;
  }

  function formatDate(d: string) {
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    const dateObj = parseDate(d);
    return dateObj ? dateObj.toLocaleDateString('pt-BR') : d;
  }

  function formatTime(t: string) {
    const [hh, mm] = t.split(':');
    return hh && mm ? `${hh}:${mm}` : t;
  }

  async function handleFinish(id: string) {
    setIsLoading(true);
    try {
      const apiClient = setupAPIClient();

      // Remove os prefixos "app-" ou "telegram-" antes de enviar ao backend
      const originalId = id.replace('app-', '').replace('telegram-', '');

      await apiClient.put('/schedule', {
        schedule_id: originalId,
        status: 'completed',
      });

      const updated = list.filter((item) => item.id !== id);
      setList(updated);
      onClose();
    } catch (err) {
      console.log(err);
      onClose();
      import('sonner').then(({ toast }) =>
        toast.error('Erro ao finalizar este serviço'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!service?.id) return;
    try {
      const apiClient = setupAPIClient();

      // Remove os prefixos "app-" ou "telegram-" antes de enviar ao backend
      const originalId = service.id
        .replace('app-', '')
        .replace('telegram-', '');

      await apiClient.put('/schedule', {
        schedule_id: originalId,
        status: 'inactive',
      });

      const updated = list.filter((item) => item.id !== service.id);
      setList(updated);
      onClose();
    } catch (err) {
      console.log(err);
      onClose();
      import('sonner').then(({ toast }) =>
        toast.error('Erro ao deletar este serviço'),
      );
    }
  }
  function handleRefresh() {
    const apiClient = setupAPIClient();
    apiClient.get('/schedule').then((response) => {
      setList(response.data);
    });
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
            <Heading fontSize="3xl" color={useColorModeValue("black", "whiteAlpha.900")}>
              Agendamentos
            </Heading>
            <Flex align="center" gap={3} mt={isMobile ? 3 : 0}>
              {newCount > 0 && (
                <Box position="relative" display="inline-block">
                  <IconButton
                    aria-label="Novos agendamentos"
                    icon={<FiBell />}
                    size="md"
                    colorScheme="orange"
                    variant="ghost"
                    color="whiteAlpha.900"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    isDisabled
                  />
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    minW="22px"
                    h="22px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight="bold"
                    px={1}
                    border="2px solid"
                    borderColor="barber.400"
                    zIndex={1}
                  >
                    {newCount > 99 ? '99+' : newCount}
                  </Badge>
                </Box>
              )}

              <Button
                bgGradient="linear(to-r, orange.400, yellow.400)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, orange.500, yellow.500)' }}
                shadow="md"
                px={6}
                onClick={handleRefresh}
              >
                <RefreshCcw />
              </Button>
              <Button
                as={Link}
                href="/new"
                prefetch={true}
                bgGradient="linear(to-r, orange.400, yellow.400)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, orange.500, yellow.500)' }}
                shadow="md"
                px={6}
              >
                Novo Agendamento
              </Button>
            </Flex>
          </Flex>

          <Divider borderColor={borderColor} mb={6} />

          {/* Filtros e Pesquisa */}
          <Flex
            direction={isMobile ? 'column' : 'row'}
            gap={4}
            mb={6}
            flexWrap="wrap"
          >
            <InputGroup flex={1} minW={isMobile ? '100%' : '300px'}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="whiteAlpha.500" />
              </InputLeftElement>
              <Input
                placeholder="Pesquisar por cliente..."
                bg="barber.900"
                color="whiteAlpha.900"
                borderColor={borderColor}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                _hover={{ borderColor: 'button.cta' }}
                _focus={{
                  borderColor: 'button.cta',
                  boxShadow: '0 0 0 1px button.cta',
                }}
              />
            </InputGroup>

            <Select
              w={isMobile ? '100%' : '200px'}
              bg="barber.900"
              color="whiteAlpha.900"
              borderColor={borderColor}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date' | 'name' | 'price')
              }
              _hover={{ borderColor: 'button.cta' }}
            >
              <option value="date" style={{ backgroundColor: '#1a202c' }}>
                Ordenar por Data
              </option>
              <option value="name" style={{ backgroundColor: '#1a202c' }}>
                Ordenar por Nome
              </option>
              <option value="price" style={{ backgroundColor: '#1a202c' }}>
                Ordenar por Preço
              </option>
            </Select>

            <Select
              w={isMobile ? '100%' : '180px'}
              bg="barber.900"
              color="whiteAlpha.900"
              borderColor={borderColor}
              value={filterSource}
              onChange={(e) =>
                setFilterSource(e.target.value as 'all' | 'app' | 'telegram')
              }
              _hover={{ borderColor: 'button.cta' }}
            >
              <option value="all" style={{ backgroundColor: '#1a202c' }}>
                Todas as fontes
              </option>
              <option value="app" style={{ backgroundColor: '#1a202c' }}>
                App
              </option>
              <option value="telegram" style={{ backgroundColor: '#1a202c' }}>
                Telegram
              </option>
            </Select>
          </Flex>

          {/* Lista de Agendamentos */}
          {isLoading ? (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
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
                  <VStack p={5} align="stretch" spacing={4} bg={cardBg}>
                    <Box>
                      <Skeleton height="12px" width="30%" mb={2} />
                      <Skeleton height="16px" width="80%" />
                    </Box>
                    <Divider borderColor={borderColor} />
                    <Box>
                      <Skeleton height="12px" width="30%" mb={2} />
                      <Skeleton height="20px" width="60%" />
                    </Box>
                    <Divider borderColor={borderColor} />
                    <Box>
                      <Skeleton height="12px" width="40%" mb={2} />
                      <Skeleton height="16px" width="70%" />
                    </Box>
                  </VStack>
                </Box>
              ))}
            </Grid>
          ) : filteredList.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              minH="400px"
              color="whiteAlpha.600"
            >
              <Icon as={FiCalendar} boxSize={16} mb={4} opacity={0.5} />
              <Text fontSize="lg" fontWeight="medium">
                {searchTerm || filterSource !== 'all'
                  ? 'Nenhum agendamento encontrado com os filtros aplicados'
                  : 'Nenhum agendamento ativo no momento'}
              </Text>
              <Text fontSize="sm" mt={2}>
                {searchTerm || filterSource !== 'all'
                  ? 'Tente ajustar os filtros de pesquisa'
                  : 'Crie um novo agendamento para começar'}
              </Text>
            </Flex>
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={4}
              w="100%"
            >
              {filteredList.map((item) => {
                const { displayDate, displayTime } = getDateTime(item);

                return (
                  <Box
                    key={item.id}
                    bg={cardBg}
                    borderRadius="xl"
                    overflow="hidden"
                    shadow="md"
                    border="1px solid"
                    borderColor={borderColor}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'xl',
                      borderColor: 'orange.400',
                    }}
                    cursor="pointer"
                    onClick={() => handleOpenModal(item)}
                    position="relative"
                  >
                    {/* Badge de Origem */}
                    <Box position="absolute" top={3} right={3} zIndex={1}>
                      <Badge
                        bg={
                          item.source === 'telegram' ? 'blue.500' : 'gray.600'
                        }
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        {item.source === 'telegram' ? (
                          <FaTelegram size={12} />
                        ) : (
                          <FaMobileAlt size={12} />
                        )}
                        {item.source === 'telegram' ? 'Telegram' : 'App'}
                      </Badge>
                      <Badge
                        bg={
                          item.status === 'active' ? 'green.500' : 'yellow.500'
                        }
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                      />
                      {item.status === 'active' ? 'Ativo' : 'Pendente'}
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
                          <Icon
                            as={IoMdPerson}
                            boxSize={6}
                            color="orange.300"
                          />
                        </Flex>
                        <VStack align="flex-start" spacing={0} flex={1}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="whiteAlpha.900"
                            noOfLines={1}
                          >
                            {item.customer}
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
                    <VStack p={5} align="stretch" spacing={4} bg={cardBg}>
                      {/* Informações do Corte */}
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Icon
                            as={FiScissors}
                            color="orange.300"
                            boxSize={4}
                          />
                          <Text
                            fontSize="xs"
                            color="whiteAlpha.600"
                            fontWeight="medium"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            Corte
                          </Text>
                        </HStack>
                        <Text
                          fontWeight="bold"
                          fontSize="md"
                          color="whiteAlpha.900"
                          pl={6}
                        >
                          {item.haircut.name}
                        </Text>
                      </Box>

                      <Divider borderColor={borderColor} />

                      {/* Preço */}
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Icon
                            as={FiDollarSign}
                            color="green.400"
                            boxSize={4}
                          />
                          <Text
                            fontSize="xs"
                            color="whiteAlpha.600"
                            fontWeight="medium"
                            textTransform="uppercase"
                            letterSpacing="wide"
                          >
                            Valor
                          </Text>
                        </HStack>
                        <Text
                          fontWeight="bold"
                          fontSize="xl"
                          color="green.400"
                          pl={6}
                        >
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(Number(item.haircut.price))}
                        </Text>
                      </Box>

                      {/* Data e Hora */}
                      {(displayDate || displayTime) && (
                        <>
                          <Divider borderColor={borderColor} />
                          <Box>
                            <HStack spacing={2} mb={2}>
                              <Icon
                                as={FiCalendar}
                                color="orange.300"
                                boxSize={4}
                              />
                              <Text
                                fontSize="xs"
                                color="whiteAlpha.600"
                                fontWeight="medium"
                                textTransform="uppercase"
                                letterSpacing="wide"
                              >
                                Agendamento
                              </Text>
                            </HStack>
                            <VStack align="flex-start" spacing={1} pl={6}>
                              {displayDate && (
                                <Text
                                  fontWeight="bold"
                                  fontSize="md"
                                  color="whiteAlpha.900"
                                >
                                  {displayDate}
                                </Text>
                              )}
                              {displayTime && (
                                <Text
                                  fontSize="sm"
                                  color="whiteAlpha.700"
                                  fontWeight="medium"
                                >
                                  {displayTime}
                                </Text>
                              )}
                            </VStack>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </Grid>
          )}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={() => service?.id && handleFinish(service.id)}
        deleteService={handleDelete}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const [response, telegramResponse] = await Promise.all([
      apiClient.get('/schedule'),
      apiClient.get('/telegramlist'),
    ]);

    // Filtrar schedules no servidor para otimizar performance
    // Apenas schedules com status 'active' serão enviados para o cliente
    const activeSchedules = response.data.filter(
      (item: ScheduleItem) => item.status === 'active',
    );

    const activeTelegram = telegramResponse.data.filter(
      (item: TelegramScheduleItem) => item.status === 'accepted',
    );

    // Buscar agendamentos pendentes (novos) - geralmente do Telegram com status 'pending'
    const pendingTelegram = telegramResponse.data.filter(
      (item: TelegramScheduleItem) => item.status === 'pending',
    );

    // Contar novos agendamentos (pendentes)
    const newAppointmentsCount = pendingTelegram.length;

    const normalizedApp: ScheduleItem[] = activeSchedules.map(
      (item: ScheduleItem) => ({
        id: `app-${item.id}`,
        customer: item.customer || 'Cliente',
        haircut: {
          id: item.haircut?.id,
          name: item.haircut?.name,
          price: item.haircut?.price,
        },
        scheduled_at: item.dataHora,
        status: item.status,
        source: 'app',
      }),
    );

    const normalizedTelegram: TelegramScheduleItem[] = activeTelegram.map(
      (item: TelegramScheduleItem) => ({
        id: `telegram-${item.id}`,
        customer: item.customerName || 'Cliente Telegram',
        haircut: {
          id: 'telegram',
          name: item.haircut?.name,
          price: item.haircut?.price,
        },
        scheduled_at: item.scheduledAt,
        status: item.status,
        source: 'telegram',
      }),
    );

    const unified: ScheduleItem[] = [
      ...normalizedApp,
      ...normalizedTelegram,
    ].sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
    );

    return {
      props: {
        schedule: unified,
        newAppointmentsCount,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        schedule: [],
        newAppointmentsCount: 0,
      },
    };
  }
});
