import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Stack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { Helmet } from "react-helmet";

import { useGeneralToasts } from "../hooks/useGeneralToast";

export default function PaymentSuccess() {
    const [errorCode, setErrorCode] = useState('');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { toastInfo } = useGeneralToasts();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const errorCode = searchParams.get("code");
        const message = searchParams.get("message");
        const orderId = searchParams.get("orderId");

        if (!orderId || !message || !errorCode) {
            navigate('/', { replace: true });
            toastInfo('잘못된 접근입니다', '홈으로 이동했습니다.');
            return;
        }

        setErrorCode(errorCode);
        setMessage(message);
        setOrderId(orderId);
    }, [location, navigate, toastInfo]);

    return (
        <Stack width="100%" mt="20vh" align="center" spacing={8}>
            <Helmet><title>결제 실패 | Rapidrary</title></Helmet>
            <WarningIcon color="red.400" boxSize="64px" />
            <Stack align="center" spacing={2}>
                <Text fontSize="1rem" fontWeight="bold">결제에 실패했습니다.</Text>
                <Text mt="1.5rem" fontSize="0.75rem" fontWeight="bold">오류 코드: {errorCode}</Text>
                <Text fontSize="0.75rem" fontWeight="bold">메시지: {message}</Text>
                <Text fontSize="0.75rem" fontWeight="bold">주문 ID: {orderId}</Text>
            </Stack>
            <Button colorScheme="blue" size="lg" onClick={() => navigate('/', { replace: true })}>홈으로 이동</Button>
        </Stack>
    );
}
