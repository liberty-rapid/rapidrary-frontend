import {
    Box,
    Flex,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerCloseButton,
    DrawerBody,
    IconButton,
    useColorMode,
    useColorModeValue
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { SiDiscord } from "react-icons/si";

import { DISCORD_SERVER_URL } from "../constants";

import AccountPanel from "./account/AccountPanel";

type MobileMenuProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("white", "gray.900");

    return (
        <Drawer size="sm" isOpen={isOpen} onClose={onClose}>
            <DrawerContent bgColor={bg} motionProps={{
                variants: {
                    enter: {
                        x: "0%",
                        transition: { duration: 0.25 },
                    },
                    exit: {
                        x: "100%",
                        transition: { duration: 0.1 },
                    },
                },
            }}>
                <DrawerHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box>
                            <IconButton
                                mr="12px"
                                pt="1px"
                                variant="ghost"
                                icon={<SiDiscord size="23px" />}
                                onClick={() => window.open(DISCORD_SERVER_URL)}
                                aria-label="디스코드"
                            />
                            <IconButton
                                mr="16px"
                                variant="ghost"
                                icon={colorMode === 'dark' ? <SunIcon boxSize="20px" /> : <MoonIcon boxSize="20px" />}
                                onClick={toggleColorMode}
                                aria-label="테마 전환"
                            />
                        </Box>
                        <DrawerCloseButton position="static" />
                    </Flex>
                </DrawerHeader>
                <DrawerBody>
                    <AccountPanel onClose={onClose} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
