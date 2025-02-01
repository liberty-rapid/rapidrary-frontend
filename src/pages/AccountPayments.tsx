import { Helmet } from "react-helmet";
import { Flex, Text, Stack, HStack, Card, CardBody, CardFooter, Tag, Skeleton } from "@chakra-ui/react";
import { RiHistoryFill, RiLoginBoxLine } from "react-icons/ri";

import { useMe } from "../hooks/query/useMe";
import { useMyPayments } from "../hooks/query/useMyPayments";

import SettingFrame from "../components/SettingFrame";
import CustomDivider from "../components/common/CustomDivider";

export default function AccountPayments() {
    const { data: me, isLoading } = useMe();
    const { data: payments, isLoading: isPaymentsLoading } = useMyPayments();

    if (isLoading || isPaymentsLoading) {
        return (
            <SettingFrame>
                <Skeleton height="195px" />
            </SettingFrame>
        );
    }

    if (!me) {
        return (
            <SettingFrame>
                <Helmet><title>결제 내역 | Rapidrary</title></Helmet>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="300px"
                >
                    <Stack align="center" spacing={4}>
                        <RiLoginBoxLine size="32px" />
                        <Text size="lg">로그인이 필요합니다.</Text>
                    </Stack>
                </Flex>
            </SettingFrame>
        );
    }

    if (payments?.length === 0 || !payments) {
        return (
            <SettingFrame>
                <Helmet><title>결제 내역 | Rapidrary</title></Helmet>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="300px"
                >
                    <Stack align="center" spacing={4}>
                        <RiHistoryFill size="32px" />
                        <Text size="lg">결제 내역이 없습니다.</Text>
                    </Stack>
                </Flex>
            </SettingFrame>
        );
    }

    payments?.sort((a, b) => b.approvedAt.localeCompare(a.approvedAt));

    return (
        <SettingFrame>
            <Helmet><title>결제 내역 | Rapidrary</title></Helmet>
            <Stack alignItems="flex-start">
                {payments!.map(payment => (
                    <Card
                        key={payment.orderId + payment.approvedAt}
                        mb={2}
                        variant="outline"
                        w="100%"
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    >
                        <CardBody w="100%">
                            <Stack spacing={0}>
                                <Text color="gray.500" fontSize="0.9rem">
                                    {new Intl.DateTimeFormat(
                                        'ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: false,
                                            timeZoneName: 'short'
                                        }).format(new Date(payment.approvedAt))}                                    
                                </Text>                                
                                <Text
                                    mt={1}
                                    fontSize={{ base: "1rem", md: "1.2rem" }}
                                    fontWeight="bold"
                                >
                                    {payment.orderName}
                                </Text>
                                <Text>
                                    <Tag mt={3} colorScheme={payment.status === 'DONE' ? 'green' : 'blue'}>
                                        {payment.status === 'DONE' ? '완료' : '취소'}
                                    </Tag>                                    
                                </Text>
                            </Stack>
                        </CardBody>
                        <CardFooter w="100%">
                            <HStack
                                flexDirection="row-reverse"
                                w="100%"
                                spacing={4}
                                divider={<CustomDivider orientation="vertical" />}
                            >
                                <Text fontWeight="bold">
                                    {new Intl.NumberFormat('ko-KR', {
                                        style: 'currency',
                                        currency: payment.currency
                                    }).format(payment.totalAmount)}
                                </Text>                                
                                <Text fontWeight="bold">{payment.method}</Text>
                            </HStack>
                        </CardFooter>
                    </Card>
                ))}
            </Stack>
        </SettingFrame>
    );
}
