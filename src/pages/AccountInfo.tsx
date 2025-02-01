import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Flex, Text, Stack, Card, CardBody, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, HStack, Input, IconButton } from "@chakra-ui/react";
import { RiDiscordFill, RiEdit2Fill, RiGithubFill, RiLoginBoxLine } from "react-icons/ri";

import { User } from "../api/apiTypes";
import { deleteMyAccount, signOutAll, updateMyDisplayName } from "../api/endpoints";
import { useGeneralToasts } from "../hooks/useGeneralToast";
import { useMe } from "../hooks/query/useMe";

import SettingFrame from "../components/SettingFrame";
import Loading from "../components/Loading";
import CustomDivider from "../components/common/CustomDivider";
import AuthModal from "../components/auth/AuthModal";

export default function AccountInfo() {
    const queryClient = useQueryClient();
    const { data: me, refetch: refetchMe, isLoading } = useMe();
    const logoutAllMutation = useMutation({ mutationFn: signOutAll });
    const deleteAccountMutation = useMutation({ mutationFn: deleteMyAccount });
    const updateDisplayNameMutation = useMutation({ mutationFn: updateMyDisplayName });

    const [newDisplayName, setNewDisplayName] = useState<string>('');
    const [deleteAccountCheckEmail, setDeleteAccountCheckEmail] = useState<string>('');

    const deleteAccountAlertDisclosure = useDisclosure();
    const updateDisplayNameAlertDisclosure = useDisclosure();
    const emailUpdateModalDisclosure = useDisclosure();

    const updateDisplayNameInputRef = useRef<HTMLInputElement>(null);
    const deleteAccountCancelRef = useRef<HTMLButtonElement>(null);

    const { toastSuccess, toastError } = useGeneralToasts();
    const navigate = useNavigate();

    const handleLogoutAllClick = async () => {
        await logoutAllMutation.mutateAsync();

        toastSuccess('로그아웃 완료', '모든 기기에서 로그아웃 되었습니다.');
        navigate('/');

        await refetchMe();
    };

    const handleDeleteAccountClick = async () => {
        try {
            await deleteAccountMutation.mutateAsync();

            deleteAccountAlertDisclosure.onClose();
            setDeleteAccountCheckEmail('');

            toastSuccess('회원 탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
            navigate('/');

            queryClient.setQueryData(['me'], null);
        } catch (e: unknown) {
            if (e instanceof Error) {
                toastError('회원 탈퇴 중 오류가 발생했습니다', e.message);           
            }
        }
    };

    const handleChangeDisplayNameClick = async () => {
        try {
            await updateDisplayNameMutation.mutateAsync(newDisplayName);

            updateDisplayNameAlertDisclosure.onClose();
            setNewDisplayName('');

            toastSuccess('표시 이름 변경 완료', newDisplayName);

            await queryClient.setQueryData(['me'], (me: User) => {
                if (!me) return;

                return {
                    ...me,
                    displayName: newDisplayName
                };
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                toastError('표시 이름 변경 중 오류가 발생했습니다', e.message);           
            }
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!me) {
        return (
            <SettingFrame>
                <Helmet><title>내 계정 | Rapidrary</title></Helmet>
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

    return (
        <SettingFrame>
            <Helmet><title>내 계정 | Rapidrary</title></Helmet>
            <AuthModal
                isOpen={emailUpdateModalDisclosure.isOpen}
                onClose={emailUpdateModalDisclosure.onClose}
                emailUpdateMode
            />
            <Stack alignItems="flex-start">
                <Text fontSize="1.2rem">계정 정보</Text>
                <CustomDivider />
                <Text fontWeight="bold">계정 ID</Text>
                <Card width="100%" variant="outline" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
                    <CardBody padding="16px">
                        {me.id}
                    </CardBody>
                </Card>
                <Text mt={2} fontWeight="bold">표시 이름</Text>
                <Card width="100%" variant="outline" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
                    <CardBody padding="16px">
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text>{me.displayName}</Text>
                            <IconButton
                                size="sm"
                                colorScheme="blue"
                                icon={<RiEdit2Fill />}
                                onClick={updateDisplayNameAlertDisclosure.onOpen}
                                aria-label="표시 이름 수정"
                            />
                        </Flex>
                    </CardBody>
                </Card>
                <Text mt={2} fontWeight="bold">이메일</Text>
                <Card width="100%" variant="outline" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
                    <CardBody padding="16px">
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text>{me.email}</Text>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={emailUpdateModalDisclosure.onOpen}
                            >
                                변경
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>
                <Text mt={2} fontWeight="bold">연결된 소셜 로그인 (OAuth)</Text>
                <Card width="100%" variant="outline" boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
                    <CardBody padding="16px">
                        <HStack spacing={4}>
                            {me.oauthAccounts.length === 0 && (
                                <Text color="#808080">
                                    Rapidrary 계정과 이메일이 같은 소셜 계정으로 로그인 시, 해당 소셜 계정과 연결된 Rapidrary 계정이 없는 경우 자동으로 연결됩니다. 
                                </Text>
                            )}
                            {me.oauthAccounts.map(account => {
                                if (account.provider === 'github') {
                                    return <RiGithubFill size="32px" key={account.provider} />;
                                } else if (account.provider === 'discord') {
                                    return <RiDiscordFill size="32px" key={account.provider} />;
                                }
                            })}                            
                        </HStack>
                    </CardBody>
                </Card>
                <Text mt="1.5rem" fontSize="1.2rem">모든 기기에서 로그아웃</Text>
                <CustomDivider />
                <Text>현재 접속중인 기기를 포함하여 모든 기기(브라우저)에서 로그아웃 됩니다.</Text>
                <Button
                    fontSize="0.9rem"
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleLogoutAllClick}
                >
                    모든 기기에서 로그아웃
                </Button>
                <Text mt="1.5rem" fontSize="1.2rem">회원 탈퇴</Text>
                <CustomDivider />
                <Text fontWeight="bold">주의: 회원 탈퇴 시 계정을 복구할 수 없습니다.</Text>
                <Button
                    fontSize="0.9rem"
                    colorScheme="red"
                    variant="outline"
                    width="100px"
                    onClick={deleteAccountAlertDisclosure.onOpen}
                >
                    회원 탈퇴
                </Button>
            </Stack>
            <AlertDialog
                isOpen={updateDisplayNameAlertDisclosure.isOpen}
                leastDestructiveRef={updateDisplayNameInputRef}
                onClose={updateDisplayNameAlertDisclosure.onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            표시 이름 수정
                        </AlertDialogHeader>
                        <AlertDialogBody
                            whiteSpace="normal"
                            wordBreak="keep-all"
                        >
                            <Input
                                ref={updateDisplayNameInputRef}
                                value={newDisplayName}
                                onChange={event => setNewDisplayName(event.target.value)}
                                size="md"
                                placeholder="새 표시 이름 입력"
                                maxLength={32}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newDisplayName !== '') {
                                        handleChangeDisplayNameClick();
                                    }
                                }}
                            />
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                onClick={() => {
                                    setNewDisplayName('');
                                    updateDisplayNameAlertDisclosure.onClose();
                                }}
                            >
                                취소
                            </Button>
                            <Button
                                ml={3}
                                colorScheme="blue"
                                isDisabled={newDisplayName === ''}
                                onClick={handleChangeDisplayNameClick}
                            >
                                수정
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <AlertDialog
                isOpen={deleteAccountAlertDisclosure.isOpen}
                leastDestructiveRef={updateDisplayNameInputRef}
                onClose={deleteAccountAlertDisclosure.onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            회원 탈퇴
                        </AlertDialogHeader>
                        <AlertDialogBody
                            whiteSpace="normal"
                            wordBreak="keep-all"
                        >
                            <Text>회원 탈퇴를 진행합니다. 실수로 인한 탈퇴를 방지하기 위해 계정에 등록된 이메일을 아래에 입력 후 탈퇴 버튼을 눌러주세요</Text>
                            <Input
                                isInvalid={deleteAccountCheckEmail !== '' && deleteAccountCheckEmail !== me.email}
                                value={deleteAccountCheckEmail}
                                onChange={event => setDeleteAccountCheckEmail(event.target.value)}
                                mt={4}
                                size="md"
                                placeholder={`'${me.email}' 입력`}
                            />
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                ref={deleteAccountCancelRef}
                                onClick={() => {
                                    setDeleteAccountCheckEmail('');
                                    deleteAccountAlertDisclosure.onClose();
                                }}
                            >
                                취소
                            </Button>
                            <Button
                                ml={3}
                                colorScheme="red"
                                isDisabled={deleteAccountCheckEmail !== me.email}
                                onClick={handleDeleteAccountClick}
                            >
                                즉시 탈퇴
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </SettingFrame>
    );
}
