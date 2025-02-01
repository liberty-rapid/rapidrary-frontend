import { Flex, useColorModeValue, Text, VStack } from "@chakra-ui/react";

export default function Footer() {
    const bgColor = useColorModeValue('#fafafa', 'gray.900');
    const color = useColorModeValue('rgba(0, 0, 0, 0.75)', 'rgba(255, 255, 255, 0.75)');

    return (
        <Flex
            justify="center"
            align="center"
            p={2}
            width="100%"
            height={import.meta.env.VITE_DISABLE_BUSINESS !== 'true' ? '200px' : '96px'}
            bg={bgColor}
        >
            <VStack spacing="12px">
                <Text
                    textAlign="center"
                    color={color}
                    fontSize={{ base: '10px', sm: '11px' }}
                >
                    Powered by Rapidrary
                </Text>
            </VStack>
        </Flex>
    );
}
