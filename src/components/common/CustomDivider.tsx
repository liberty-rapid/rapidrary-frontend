import { Divider, DividerProps, useColorMode } from "@chakra-ui/react";

export default function CustomDivider(props: DividerProps) {
    const { colorMode } = useColorMode();

    return <Divider {...props} borderColor={colorMode === 'light' ? '#aaaaaa' : '#444444'} />;
}
