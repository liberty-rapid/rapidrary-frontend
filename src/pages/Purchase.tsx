import { isAxiosError } from "axios";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    Flex,
    HStack,
    Stack,
    Text,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    useBreakpointValue,
    useBoolean
} from "@chakra-ui/react";

import { TOSSPAYMENTS_CLIENT_KEY } from "../constants";

import { generateRandomString } from "../utils/common-utils";
import { getNextContent } from "../utils/book-helper";
import { createOrder, fetchMe } from "../api/endpoints";
import { PurchaseLoaderData } from "../loader/purchaseLoader";
import { useGeneralToasts } from "../hooks/useGeneralToast";
import { useMe } from "../hooks/query/useMe";

export default function Purchase() {
    const { data: me, isLoading: isLoadingMe } = useMe();

    const { book } = useLoaderData() as PurchaseLoaderData;
    const [ready, setReady] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [widgets, setWidgets] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [paymentMethodsWidget, setPaymentMethodsWidget] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [agreementWidget, setAgreementWidget] = useState<any>(null);
    const [isPayButtonLoading, setIsPayButtonLoading] = useBoolean();

    const queryClient = useQueryClient();
    const createOrderMutation = useMutation({ mutationFn: createOrder });

    const navigate = useNavigate();    
    const { toastInfo, toastError } = useGeneralToasts();

    const isMobile = useBreakpointValue({ base: true, xl: false }, { ssr: false });

    useEffect(() => {
        if (!isLoadingMe && !me)
            navigate(-1);
    }, [me, isLoadingMe, navigate]);

    useEffect(() => {
        setReady(false);

        const handleInvalidAccess = () => {
            navigate('/', { replace: true });
        };

        (async () => {
            const me = await queryClient.fetchQuery({
                queryKey: ['me'],
                queryFn: fetchMe,
                staleTime: 180 * 1000,
                gcTime: 180 * 1000
            });

            if (me === null) {
                handleInvalidAccess();
                return;
            }

            if (me.books.includes(book.id)) {
                const firstContent = getNextContent(book);

                if (firstContent !== null) {
                    navigate(`/${book.id}/${firstContent.file}`, { replace: true });
                }
    
                return;
            }

            const tossPayments = await loadTossPayments(TOSSPAYMENTS_CLIENT_KEY);
            const widgets = tossPayments.widgets({ customerKey: me.id });

            setWidgets(widgets);
        })();
    }, [book, book.id, queryClient, navigate, toastInfo]);

    useEffect(() => {
        if (!widgets || !book) {
            return;
        }

        async function renderPaymentWidgets() {
            await widgets.setAmount({
                currency: book!.currency,
                value: book!.price
            });

            setPaymentMethodsWidget(
                await widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                })
            );

            setAgreementWidget(
                await widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                })             
            );

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, book]);

    const onCancelClick = () => {
        paymentMethodsWidget?.destroy();
        agreementWidget?.destroy();
        navigate(-1);
    };

    const onPayClick = async () => {
        const orderId = generateRandomString(16);

        try {
            await createOrderMutation.mutateAsync({
                orderId,
                amount: book!.price,
                bookId: book!.id
            });
        } catch (e: unknown) {
            let message = '';

            if (isAxiosError(e) && e.response) {
                message = e.response.data.message;
            } else if (e instanceof Error) {
                message = e.message;
            }

            toastError('오류가 발생했습니다', message);
            return;
        }

        try {
            setIsPayButtonLoading.on();
            await widgets?.requestPayment({
                orderId,
                orderName: book!.title,
                successUrl: window.location.origin + "/payment-success" + `?bookId=${book!.id}`,
                failUrl: window.location.origin + "/payment-fail" + `?bookId=${book!.id}`
            });
            setIsPayButtonLoading.off();
        } catch (e: unknown) {
            setIsPayButtonLoading.off();
            if (e instanceof Error) {
                toastInfo(e.message);
            }
        }
    };

    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: book.currency
    }).format(book.price);

    return (
        <Stack
            px={3}
            justify="center"
            w={isMobile ? '100%' : 'auto'}
            direction={isMobile ? 'column' : 'row'}
            mt={isMobile ? '16px' : '20vh'}
            spacing={4}
        >
            <Helmet>
                <title>콘텐츠 구매 | Rapidrary</title>
            </Helmet>
            <Flex
                direction="column"
                w={isMobile ? '100%' : "500px"}
                h={isMobile ? 'auto' : "400px"}
                borderRadius="4px"                
                bg="white"
            >
                <Box
                    id="payment-method"
                    flexGrow={1}
                    overflow="hidden"
                    w="100%"
                    borderRadius="4px"
                />
                <Box 
                    id="agreement"
                    mt="16px"
                    overflow="hidden"
                    w="100%"
                    borderRadius="4px"
                />                                        
            </Flex>
            <Card
                w={isMobile ? '100%' : '500px'}
                h={isMobile ? 'auto' : '400px'}
                mb='16px'
                variant="outline"
            >
                <CardHeader fontWeight="bold">정보</CardHeader>
                <CardBody>
                    <Stack spacing={2} divider={<Divider />}>
                        <Flex justify="space-between">
                            <Text fontWeight="bold">콘텐츠</Text>
                            <Text>{book.title}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text fontWeight="bold">제공기간</Text>
                            <Text>무제한 ∞</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text fontWeight="bold">결제 금액 (VAT 포함)</Text>
                            <Text fontWeight="bold">{formattedPrice}</Text>
                        </Flex>
                    </Stack>
                </CardBody>
                <CardFooter>
                    <Flex w="100%" flexFlow="row-reverse">
                        <HStack spacing={2}>
                            <Button
                                onClick={onCancelClick}
                                variant="ghost"
                                size="lg"
                                colorScheme="blue"                                
                            >
                                취소
                            </Button>
                            <Button
                                onClick={onPayClick}
                                isDisabled={!ready}
                                isLoading={!ready || isPayButtonLoading}
                                size="lg"          
                                colorScheme="blue"
                            >
                                결제하기
                            </Button>                                    
                        </HStack>
                    </Flex>
                </CardFooter>
            </Card>
        </Stack>
    );
}
