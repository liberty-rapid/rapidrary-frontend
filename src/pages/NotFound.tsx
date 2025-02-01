import { useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
import { Button, Stack, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Stack mt="20vh" align="center" p={4}>
            <Helmet><title>404 Not Found | Rapidrary</title></Helmet>
            <InfoIcon boxSize="8rem" />
            <Text mt="1rem" fontSize="1rem">페이지를 찾을 수 없습니다.</Text>
            <Text
                mt="0.3rem"
                fontSize={{ base: '0.75rem', sm: '0.9rem' }}
            >
                해당 페이지가 더 이상 존재하지 않거나 URL이 올바르지 않을 수 있습니다.
            </Text>
            <Button
                onClick={() => navigate('/')}
                mt="1.5rem"
                colorScheme="blue"
            >
                홈으로 이동
            </Button>
        </Stack>
    );
}
