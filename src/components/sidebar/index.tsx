import {
  Box,
  BoxProps,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiHelpCircle,
  FiMenu,
  FiMoon,
  FiScissors,
  FiSun,
  FiUser,
  FiUsers,
} from 'react-icons/fi';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  category?: 'main' | 'account';
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Agenda', icon: FiCalendar, route: '/dashboard', category: 'main' },
  { name: 'Cortes', icon: FiScissors, route: '/haircuts', category: 'main' },
  {
    name: 'Relatórios',
    icon: FiBarChart2,
    route: '/reports',
    category: 'main',
  },
  { name: 'Caixa', icon: FiDollarSign, route: '/cashier', category: 'main' },
  { name: 'Clientes', icon: FiUsers, route: '/clientes', category: 'main' },
  { name: 'Suporte', icon: FiHelpCircle, route: '/support', category: 'main' },
  { name: 'Minha Conta', icon: FiUser, route: '/profile', category: 'account' },
];

export function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'barber.900')}>
      <SidebarContent
        onClose={() => onClose()}
        display={{ base: 'none', md: 'block' }}
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

      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
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
  const router = useRouter();
  const mainItems = LinkItems.filter((item) => item.category === 'main');
  const accountItem = LinkItems.find((item) => item.category === 'account');

  return (
    <Flex
      direction="column"
      h="full"
      borderRight="1px"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      {...rest}
    >
      {/* Logo */}
      <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
        <Link href="/dashboard">
          <Flex
            cursor="pointer"
            userSelect="none"
            flexDirection="row"
            align="center"
          >
            <Text
              fontSize="2xl"
              fontFamily="monospace"
              fontWeight="bold"
              color="white"
            >
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
        <CloseButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          color="white"
        />
      </Flex>

      <Divider borderColor={useColorModeValue('gray.200', 'gray.700')} mb={2} />

      {/* Main Navigation Items */}
      <Flex direction="column" flex={1} overflowY="auto" py={2}>
        {mainItems.map((link) => (
          <NavItem
            icon={link.icon}
            route={link.route}
            key={link.name}
            isActive={router.pathname === link.route}
          >
            {link.name}
          </NavItem>
        ))}
      </Flex>

      <Divider borderColor={useColorModeValue('gray.200', 'gray.700')} mt={2} />

      {/* Account Item */}
      {accountItem && (
        <NavItem
          icon={accountItem.icon}
          route={accountItem.route}
          key={accountItem.name}
          isActive={router.pathname === accountItem.route}
          mt={2}
        >
          {accountItem.name}
        </NavItem>
      )}
    </Flex>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  route: string;
  isActive?: boolean;
}

const NavItem = ({
  icon,
  children,
  route,
  isActive = false,
  ...rest
}: NavItemProps) => {
  return (
    <Link href={route} prefetch={true} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        mb={1}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isActive ? 'white' : 'whiteAlpha.700'}
        bg={isActive ? 'barber.900' : 'transparent'}
        transition="all 0.2s"
        _hover={{
          bg: 'barber.900',
          color: 'white',
          transform: 'translateX(4px)',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr={4}
            fontSize="22"
            as={icon}
            color={isActive ? 'button.cta' : 'currentColor'}
            _groupHover={{
              color: 'button.cta',
            }}
            transition="color 0.2s"
          />
        )}
        <Text fontWeight={isActive ? 'semibold' : 'normal'} fontSize="sm">
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const bg = useColorModeValue('white', 'gray.900');
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg="barber.400"
      borderBottomWidth="1px"
      borderBottomColor={border}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="ghost"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
        color="white"
        _hover={{ bg: 'barber.900' }}
      />

      <Flex flexDirection="row" ml={4}>
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="white"
        >
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
      icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
      variant="ghost"
      color="button.cta"
      {...props}
    />
  );
}
