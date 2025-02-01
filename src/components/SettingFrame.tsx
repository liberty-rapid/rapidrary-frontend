import { ReactNode } from "react";
import { Box, Stack, Center } from "@chakra-ui/react";

import SettingMenu from "./SettingMenu";

type SettingFrameProps = {
    children: ReactNode
};

export default function SettingFrame({ children }: SettingFrameProps) {
    return (
        <Center mt={{ base: "8px", lg: "64px" }} width="100%">
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={{ base: '16px', lg: '48px' }}
                p={4}
                width={{ base: "100%", lg: "auto" }}
            >
                <Box
                    width={{ base: '100%', lg: '220px' }}
                >
                    <SettingMenu />
                </Box>
                <Box
                    width={{ base: '100%', lg: '830px' }}
                >
                    {children}
                </Box>
            </Stack>            
        </Center>
    );
}
