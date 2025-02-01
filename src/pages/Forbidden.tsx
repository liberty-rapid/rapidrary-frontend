import { useNavigate } from "react-router-dom";
import { InfoIcon } from "@chakra-ui/icons";
import { Button, Stack, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <Stack mt="20vh" align="center" p={4}>
            <Helmet><title>403 Forbidden | Rapidrary</title></Helmet>
            <InfoIcon boxSize="8rem" />
            <Text mt="1rem" fontSize="1rem">이 페이지에 접근할 수 있는 권한이 없습니다.</Text>
            <Text
                mt="0.3rem"
                fontSize={{ base: '0.75rem', sm: '0.9rem' }}
            >
                계정을 확인하시거나 관리자에게 문의해주세요
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
