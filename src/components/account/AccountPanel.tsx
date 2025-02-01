import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Stack, HStack, Text, Button, Tag, useDisclosure, useColorMode } from "@chakra-ui/react";
import { RiBook2Fill, RiLogoutBoxLine, RiSettings3Fill, RiUser3Fill } from "react-icons/ri";

import { signOut } from "../../api/endpoints";
import { useMe } from "../../hooks/query/useMe";
import { useGeneralToasts } from "../../hooks/useGeneralToast";

import AuthModal from "../auth/AuthModal";

type AccountPanelProps = {
    onClose: () => void
};

export default function AccountPanel({ onClose }: AccountPanelProps) {
    const { data: me, refetch: refetchMe } = useMe();
    const logoutMutation = useMutation({ mutationFn: signOut });

    const { colorMode } = useColorMode();

    const loginDisclosure = useDisclosure();
    const { toastSuccess } = useGeneralToasts();

    const location = useLocation();
    const navigate = useNavigate();

    const onLogoutClick = async () => {
        await logoutMutation.mutateAsync();
        await refetchMe();

        toastSuccess('로그아웃 완료', '로그아웃 되었습니다.');
        onClose();
    };

    const onMyBooksClick = () => {
        if (location.pathname !== '/my/books')
            navigate('/my/books');

        onClose();
    };

    const onSettingClick = () => {
        if (location.pathname !== '/my/account')
            navigate('/my/account');

        onClose();
    };

    return (
        <>
            <Stack spacing="8px">
                {me && (
                    <Tag
                        py={2}
                        border={colorMode === 'light' ? '1px solid #e0e0e0' : undefined}
                        colorScheme={colorMode === 'light' ? "white" : undefined}
                    >
                        <HStack align="center" height="30px">
                            <RiUser3Fill size="22px" />
                            <Text ml="2px" fontWeight="bold">{me.displayName}</Text>
                        </HStack>
                    </Tag>                    
                )}
                {!me ? (
                    <Button
                        display={import.meta.env.VITE_DISABLE_BUSINESS !== 'true' ? undefined : 'none'}
                        width="100%"
                        variant={{ base: 'solid', md: 'ghost' }}
                        onClick={loginDisclosure.onOpen}
                    >
                        회원가입 / 로그인
                    </Button>
                ) : (
                    <>
                        <HStack spacing={2}>
                            <Button
                                flexGrow={1}
                                leftIcon={<RiBook2Fill />}
                                onClick={onMyBooksClick}
                                variant={colorMode === 'light' ? 'outline' : 'solid'}
                            >
                                내 서재
                            </Button>                    
                            <Button
                                flexGrow={1}
                                leftIcon={<RiSettings3Fill />}
                                onClick={onSettingClick}
                                variant={colorMode === 'light' ? 'outline' : 'solid'}
                            >
                                계정 설정
                            </Button>                            
                        </HStack>
                        <Button
                            width="100%"
                            variant={{ base: 'outline', md: 'ghost' }}
                            isLoading={logoutMutation.isPending}
                            leftIcon={<RiLogoutBoxLine />}
                            onClick={onLogoutClick}
                        >
                            로그아웃
                        </Button>
                    </>
                )}
            </Stack>
            <AuthModal
                isOpen={loginDisclosure.isOpen}
                onClose={loginDisclosure.onClose}
                onLogin={onClose}
            /> 
        </>
    );
}
