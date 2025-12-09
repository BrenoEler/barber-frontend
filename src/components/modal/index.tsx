import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  HStack,
  Icon,
  Box,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

import { FaCalendar, FaMoneyBillAlt } from 'react-icons/fa';
import { FiScissors, FiUser, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { formatDateTime, formaterPrice } from '../../helper';
import { ScheduleItem } from '../../pages/dashboard';

interface ModalInfoProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data?: ScheduleItem;
  finishService: () => Promise<void>;
  deleteService: () => Promise<void>;
}

export function ModalInfo({
  isOpen,
  onOpen,
  onClose,
  data,
  finishService,
  deleteService,
}: ModalInfoProps) {
  const borderColor = useColorModeValue("whiteAlpha.200", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent bg="barber.400" borderRadius="xl" border="1px solid" borderColor={borderColor}>
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FiUser} color="button.cta" boxSize={6} />
            <Text color="whiteAlpha.900" fontSize="xl" fontWeight="bold">
              Detalhes do Agendamento
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.700" _hover={{ color: "white" }} />
        
        <Divider borderColor={borderColor} />
        
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            {/* Cliente */}
            <Box
              bg="barber.900"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={FiUser} color="button.cta" boxSize={5} />
                <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Cliente
                </Text>
              </HStack>
              <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900" pl={8}>
                {data?.customer || "Não informado"}
              </Text>
            </Box>

            {/* Serviço */}
            <Box
              bg="barber.900"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={FiScissors} color="whiteAlpha.700" boxSize={5} />
                <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Serviço
                </Text>
              </HStack>
              <Text fontSize="md" fontWeight="semibold" color="whiteAlpha.900" pl={8}>
                {data?.haircut?.name || "Não informado"}
              </Text>
            </Box>

            {/* Data e Hora */}
            <Box
              bg="barber.900"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={FaCalendar} color="#FFb13e" boxSize={5} />
                <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Data e Horário
                </Text>
              </HStack>
              <Text fontSize="md" fontWeight="semibold" color="whiteAlpha.900" pl={8}>
                {formatDateTime(
                  data?.dataHora === undefined
                    ? data?.scheduled_at
                    : data?.dataHora,
                ) || "Não informado"}
              </Text>
            </Box>

            {/* Preço */}
            <Box
              bg="barber.900"
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={FaMoneyBillAlt} color="#46ef75" boxSize={5} />
                <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Valor
                </Text>
              </HStack>
              <Text fontSize="xl" fontWeight="bold" color="#46ef75" pl={8}>
                {data?.haircut?.price ? formaterPrice(Number(data?.haircut?.price)) : "Não informado"}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        
        <Divider borderColor={borderColor} />
        
        <ModalFooter>
          <HStack spacing={3} w="100%">
            <Button
              variant="outline"
              flex={1}
              leftIcon={<Icon as={FiTrash2} />}
              borderColor="red.400"
              color="red.400"
              _hover={{ bg: "red.50", borderColor: "red.500", color: "red.500" }}
              onClick={() => deleteService()}
            >
              Deletar
            </Button>
            <Button
              flex={1}
              leftIcon={<Icon as={FiCheckCircle} />}
              bgGradient="linear(to-r, button.cta, #FFb13e)"
              color="gray.900"
              _hover={{
                bgGradient: "linear(to-r, #FFb13e, button.cta)",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              onClick={() => finishService()}
              fontWeight="bold"
              transition="all 0.2s"
            >
              Finalizar Serviço
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
