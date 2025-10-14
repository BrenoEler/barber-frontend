import { Badge, HStack, Text, Icon } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";

//Config horarios

const schedule = {
  1: { open: "540", close: "1080" }, // Segunda 09:00 - 18:00
  2: { open: "540", close: "1080" }, // Segunda 09:00 - 18:00
  3: { open: "540", close: "1080" }, // Segunda 09:00 - 18:00
  4: { open: "540", close: "1080" }, // Segunda 09:00 - 18:00
  5: { open: "540", close: "1080" }, // Segunda 09:00 - 18:00
  6: { open: "540", close: "960" }, // Segunda 09:00 - 16:00
};

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");

  return `${h}:${m}`;
};

export function BusinessHoursChip() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  const todaysHours = schedule[dayOfWeek];
  let isOpen = false;
  let statusText = "Fechado";
  let hoursText = "Abre amanhã";

  if (todaysHours) {
    isOpen =
      currentTimeInMinutes >= todaysHours.open &&
      currentTimeInMinutes < todaysHours.close;

    // Define o texto com base no status
    if (isOpen) {
      statusText = "Aberto agora";
      hoursText = `Fecha às ${formatTime(todaysHours.close)}`;
    } else if (currentTimeInMinutes < todaysHours.open) {
      statusText = "Fechado";
      hoursText = `Abre às ${formatTime(todaysHours.open)}`;
    } else {
      statusText = "Fechado";
      let nextDay = dayOfWeek + 1;
      while (!schedule[nextDay % 7] && nextDay < dayOfWeek + 7) {
        nextDay++;
      }
      const nextOpeningDay = schedule[nextDay % 7];
      if (nextOpeningDay) {
        hoursText = `Abre amanhã às ${formatTime(nextOpeningDay.open)}`;
      }
    }
  } else {
    statusText = "Fechado";
  }

  return (
    <HStack
      border="1px solid"
      borderColor={isOpen ? "green.200" : "gray.200"}
      bg={isOpen ? "green.50" : "gray.50"}
      borderRadius="full"
      px={4}
      py={2}
      spacing={3}
      align="center"
    >
      <Badge
        colorScheme={isOpen ? "green" : "red"}
        variant="solid"
        borderRadius="full"
        px={2}
      >
        {statusText}
      </Badge>
      <HStack spacing={2} align="center" color="gray.600">
        <Icon as={FaClock} />
        <Text fontSize="sm">Seg - Sex: 09:00 - 18:00 | Sáb: 09:00 - 16:00</Text>
      </HStack>
    </HStack>
  );
}
