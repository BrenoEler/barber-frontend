import {
  Flex,
  Text,
  Icon,
  Box,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReportProps } from "../../pages/reports";

export function ReportCard({ item }: { item: ReportProps }) {
  const cardBg = useColorModeValue("barber.400", "gray.800");
  const borderColor = useColorModeValue("whiteAlpha.300", "gray.600");
  const hoverBg = useColorModeValue("whiteAlpha.200", "gray.700");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        borderColor: "orange.400",
        bg: hoverBg,
      }}
      cursor="pointer"
      h="100%"
    >
      <VStack
        p={6}
        align="center"
        justify="center"
        spacing={4}
        minH="140px"
      >
        <Flex
          align="center"
          justify="center"
          w={12}
          h={12}
          borderRadius="full"
          bg="orange.400"
          opacity={0.2}
        >
          <Icon as={item.icon} boxSize={6} color="orange.300" />
        </Flex>

        <VStack spacing={1} align="center">
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="whiteAlpha.700"
            textAlign="center"
            noOfLines={2}
          >
            {item.name}
          </Text>

          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="whiteAlpha.900"
            textAlign="center"
          >
            {item.value
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(item.value)
              : item.quantity?.toLocaleString("pt-BR") || "0"}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
