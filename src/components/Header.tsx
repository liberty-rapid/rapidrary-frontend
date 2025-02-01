import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    Img,
    IconButton,
    useColorMode,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Button
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { SiDiscord } from "react-icons/si";
import { IoCardOutline, IoLanguage, IoListSharp } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";

import { DISCORD_SERVER_URL } from "../constants";
import { Book } from "../api/apiTypes";
import { useMe } from "../hooks/query/useMe";

import AccountPopover from "./account/AccountPopover";
import AuthModal from "./auth/AuthModal";
import MobileMenu from "./MobileMenu";
import PaidBookModal from "./book/PaidBookModal";
import LanguageSelector from "./language/LanguageSelector";

import whiteLogo from "../assets/images/logo-white.svg";
import blackLogo from "../assets/images/logo-black.svg";

import whiteIconOnlyLogo from "../assets/images/icon-only-logo-white.svg";
import blackIconOnlyLogo from "../assets/images/icon-only-logo-black.svg";
import { useTranslation } from "react-i18next";

type HeaderProps = {
    book?: Book;
    toggleTOC?: () => void;
    isTOCOpen?: boolean;
};

export default function Header({ book, toggleTOC, isTOCOpen }: HeaderProps) {
    const { t } = useTranslation('common');

    const location = useLocation();

    const { data: me } = useMe();
    const isNotPurchasedBook = book && book.price !== 0 && !me?.books.includes(book.id);

    const navigate = useNavigate();
    const popoverDisclosure = useDisclosure();
    const loginDisclosure = useDisclosure();
    const mobileMenuDisclosure = useDisclosure();
    const bookModalDisclosure = useDisclosure();

    const { colorMode, toggleColorMode } = useColorMode();
    const showFullMenu = useBreakpointValue({ base: false, md: true }, { ssr: false });     
    const bgColor = useColorModeValue("#fafafa", "#171923");

    const viewerItemColor = useColorModeValue("#4a4a4a", "#a7a9b3");
    const normalItemColor = useColorModeValue("#4a4a4a", "#c7c9e3");
    const titleColor = useColorModeValue("#7a7a7a", "#777993");

    const iconColor = book ? viewerItemColor : normalItemColor;

    const fullMenu = (
        <Box display={showFullMenu ? 'block' : 'none'}>
            {!book && <LanguageSelector
                mr="5px"
                icon={<IoLanguage color={iconColor} size="20px" />}
                variant="ghost"
                title={t("language")}
                aria-label={t("language")}
            />}
            <IconButton
                mr="6px"
                pt="1px"
                variant="ghost"
                icon={<SiDiscord color={iconColor} size="21px" />}
                onClick={() => window.open(DISCORD_SERVER_URL)}
                title="Discord"
                aria-label={"Discord"}
            />
            <IconButton
                mr={import.meta.env.VITE_DISABLE_BUSINESS !== 'true' ? '6px' : '16px'}
                variant="ghost"
                icon={colorMode === 'dark'
                    ? <SunIcon color={iconColor} boxSize="19px" />
                    : <MoonIcon color={iconColor} boxSize="19px" />
                }
                onClick={toggleColorMode}
                title={t("switch_color_mode")}
                aria-label={t("switch_color_mode")}
            />
            {!me ? (
                import.meta.env.VITE_DISABLE_BUSINESS !== 'true' && <Button
                    mr="16px"
                    size="sm"
                    variant="outline"
                    onClick={loginDisclosure.onOpen}
                    aria-label="로그인"
                >
                    로그인
                </Button>
            ) : (
                <AccountPopover
                    triggerIconColor={iconColor}
                    isOpen={popoverDisclosure.isOpen}
                    onOpen={popoverDisclosure.onOpen}
                    onClose={popoverDisclosure.onClose}
                />
            )}
        </Box>
    );

    const hamburgerIcon = (
        <IconButton
            mr="16px"
            variant="ghost"
            icon={<HamburgerIcon color={iconColor} boxSize="18px" />}
            onClick={mobileMenuDisclosure.onOpen}
            aria-label={t("menu")}
        />
    );

    const logoUrl = colorMode === 'dark'
        ? (book ? whiteIconOnlyLogo : whiteLogo)
        : (book ? blackIconOnlyLogo : blackLogo);

    return (
        <Box position="relative" width="100%">
            {isNotPurchasedBook && (
                <PaidBookModal
                    isOpen={bookModalDisclosure.isOpen}
                    onClose={bookModalDisclosure.onClose}
                    book={book}
                />
            )}
            <AuthModal
                isOpen={loginDisclosure.isOpen}
                onClose={loginDisclosure.onClose}
            />
            <MobileMenu
                isOpen={mobileMenuDisclosure.isOpen}
                onClose={mobileMenuDisclosure.onClose}
            />            
            <Flex
                as="header"
                justifyContent="space-between"
                width="100%"
                height="64px"
                align="center"
                backgroundColor={book ? `${bgColor}d0` : bgColor}
                backdropFilter={book ? 'blur(10px)' : undefined}
            >
                <Flex minW="120px" alignItems="center">
                    {book ? (
                        <>
                            <IconButton
                                display={{ base: 'inline-flex', xl: isTOCOpen ? 'none' : 'inline-flex' }}
                                ml="12px"
                                variant="ghost"
                                icon={<IoListSharp color={iconColor} size="22px" />}
                                onClick={() => toggleTOC && toggleTOC()}
                                aria-label={t('table_of_contents')}
                                title={t('table_of_contents')}
                            />
                            <IconButton
                                ml={{ base: '4px', xl: isTOCOpen ? '12px' : '4px'}}
                                variant="ghost"
                                icon={<RiHome2Fill color={iconColor} size="20px" />}
                                onClick={() => location.pathname !== '/' && navigate("/")}
                                aria-label={t('home')}
                                title={t('home')}
                            />
                        </>
                    ) : (
                        <Img
                            src={logoUrl}
                            alt="logo"
                            ml="16px"
                            width="136px"
                            height="32px"
                            cursor="pointer"
                            onClick={() => location.pathname !== '/' && navigate("/")}
                        />
                    )}
                </Flex>
                <Flex minW={{ base: 'none', md: '150px' }} justifyContent="center" alignItems="center">
                    {isNotPurchasedBook && (
                        <Button
                            visibility={{ base: isTOCOpen ? 'hidden' : 'visible', xl: 'visible' }}
                            variant="outline"
                            leftIcon={<IoCardOutline size="17px" />}
                            onClick={bookModalDisclosure.onOpen}
                        >
                            콘텐츠 구매
                        </Button>
                    )}
                    {!isNotPurchasedBook && (
                        <Text
                            visibility={{ base: 'hidden', md: 'visible' }}
                            color={titleColor}
                            fontSize="1.20rem"
                            fontWeight="300"
                        >
                            {book?.title}
                        </Text>
                    )}
                </Flex>
                <Flex minW="120px" justifyContent="flex-end">
                    {fullMenu}{!showFullMenu && hamburgerIcon}
                </Flex>
            </Flex>
        </Box>
    );
}
