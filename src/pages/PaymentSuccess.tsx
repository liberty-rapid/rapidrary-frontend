import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, CircularProgress, Stack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { Helmet } from "react-helmet";

import { confirmPayment, fetchBook } from "../api/endpoints";
import { getNextContent } from "../utils/book-helper";
import { useMe } from "../hooks/query/useMe";
import { useGeneralToasts } from "../hooks/useGeneralToast";

export default function PaymentSuccess() {
    const { refetch: refetchMe } = useMe();
    const { mutate: mutateConfirmPayment } = useMutation({ mutationFn: confirmPayment });

    const queryClient = useQueryClient();

    const location = useLocation();
    const navigate = useNavigate();
    const { toastInfo, toastSuccess } = useGeneralToasts();

    const [paymentState, setPaymentState] = useState<'pending' | 'success' | 'error'>('pending');
    const [error, setError] = useState('error');

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentKey = searchParams.get("paymentKey");
    const bookId = searchParams.get("bookId");

    useEffect(() => {
        if (!orderId || !amount || isNaN(Number(amount)) || !paymentKey || !bookId) {
            navigate('/', { replace: true });
            toastInfo('잘못된 접근입니다', '홈으로 이동했습니다.');
            return;
        }
    
        mutateConfirmPayment({ orderId, amount: Number(amount), paymentKey }, {
            onSuccess: () => {
                setPaymentState('success');
            },
            onError: (error: unknown) => {
                if (isAxiosError(error) && error.response) {
                    const { code, message } = error.response.data;
                    setError(`${code}: ${message}`);
                    setPaymentState('error');     
                }
            }
        });
    }, [ orderId, amount, paymentKey, bookId, mutateConfirmPayment, location, navigate, toastInfo]);

    useEffect(() => {
        if (paymentState === 'success') {
            refetchMe();

            const bookId = searchParams.get("bookId")!;
            
            queryClient.fetchQuery({
                queryFn: () => fetchBook(bookId),
                queryKey: ['book', bookId],
                staleTime: 5 * 60 * 1000,
                gcTime: 5 * 60 * 1000
            })
                .then(book => {
                    toastSuccess('구매가 완료되었습니다', book.title, 10000);
                    navigate(`/${book.id}/${getNextContent(book)!.file}`, { replace: true });
                })
                .catch(() => {
                    toastSuccess('구매가 완료되었습니다', '', 10000);
                    navigate('/', { replace: true });
                });
        }
    }, [refetchMe, paymentState, navigate, toastSuccess, searchParams, queryClient]);

    if (paymentState === 'pending') {
        return (
            <Stack width="100%" mt="20vh" align="center" spacing={8}>
                <Helmet><title>결제 진행 중 | Rapidrary</title></Helmet>
                <CircularProgress size="64px" color="cyan.400" isIndeterminate />
                <Text fontSize="1rem" fontWeight="bold">결제를 승인하는 중입니다</Text>        
            </Stack>
        );
    } else if (paymentState === 'error') {
        return (
            <Stack width="100%" mt="20vh" align="center" spacing={5}>
                <Helmet><title>결제 실패 | Rapidrary</title></Helmet>
                <WarningIcon boxSize="64px" />
                <Stack align="center" spacing={8}>
                    <Text fontSize="1rem" fontWeight="bold">결제 승인에 실패했습니다.</Text>
                    <Text fontSize="0.75rem" fontWeight="bold">{error}</Text>
                    <Button colorScheme="blue" size="lg" onClick={() => navigate('/', { replace: true })}>홈으로 이동</Button>
                </Stack>
            </Stack>
        );
    }

    return <></>;
}
