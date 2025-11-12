import { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useColorMode,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Divider,
} from "@chakra-ui/react";

import {
  FiScissors,
  FiClipboard,
  FiSettings,
  FiMenu,
  FiBarChart,
  FiCreditCard,
  FiHelpCircle,
} from "react-icons/fi";
import { FaUserCog } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { IconType } from "react-icons";
import Link from "next/link";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Agenda", icon: FiScissors, route: "/dashboard" },
  { name: "Cortes", icon: FiClipboard, route: "/haircuts" },
  { name: "Relatórios", icon: FiBarChart, route: "/reports" },
  { name: "Caixa", icon: FiCreditCard, route: "/cashier" },
  { name: "Suporte", icon: FiHelpCircle, route: "/support" },
  { name: "Minha Conta", icon: FaUserCog, route: "/profile" },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "barber.900")}>
      <SidebarContent
        onClose={() => onClose()}
        display={{ base: "none", md: "block" }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
        onClose={onClose}
      >
        <DrawerContent>
          <SidebarContent onClose={() => onClose()} />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={4}>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const mainItems = LinkItems.filter((item) => item.name !== "Minha Conta");
  const userSetting = LinkItems.find((item) => item.name === "Minha Conta");

  const bg = useColorModeValue("gray.500", "barber.400");
  const borderColor = useColorModeValue("gray.500", "red.700");

  return (
    <Flex
      direction="column"
      h="full"
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
        <Link href="/dashboard">
          <Flex cursor="pointer" userSelect="none" flexDirection="row">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              Barber
            </Text>
            <Text
              fontSize="2xl"
              fontFamily="monospace"
              fontWeight="bold"
              color="button.cta"
            >
              PRO
            </Text>
          </Flex>
        </Link>
        <Flex align="center" gap={2}>
          <ColorModeToggle />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
      </Flex>

      {mainItems.map((link) => (
        <NavItem icon={link.icon} route={link.route} key={link.name}>
          {link.name}
        </NavItem>
      ))}

      {userSetting && (
        <NavItem
          marginTop="auto"
          icon={userSetting.icon}
          route={userSetting.route}
          key={userSetting.name}
        >
          {userSetting.name}
        </NavItem>
      )}
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  route: string;
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
  const hoverBg = useColorModeValue("gray.300", "barber.900");

  return (
    <Link href={route} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: hoverBg,
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={4}
            fontSize="30"
            as={icon}
            _groupHover={{
              color: "white",
            }}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const bg = useColorModeValue("white", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={border}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Flex flexDirection="row" alignItems="center" ml={4}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Barber
        </Text>
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="button.cta"
        >
          PRO
        </Text>
      </Flex>
      <ColorModeToggle ml="auto" />
    </Flex>
  );
};

function ColorModeToggle(props?: any) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Alternar tema"
      icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
      variant="ghost"
      color="button.cta"
      {...props}
    />
  );
};
