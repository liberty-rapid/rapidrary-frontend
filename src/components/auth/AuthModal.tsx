import { isAxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalContent,
    ModalOverlay,
    useColorMode
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EmailVerification, User } from "../../api/apiTypes";
import { useLoginMutations } from "../../hooks/mutation/useLoginMutations";
import { useGeneralToasts } from "../../hooks/useGeneralToast";

import { DISCORD_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_ID } from "../../constants";

import EmailInputStage from "./EmailInputStage";
import VerificationStage from "./VerificationStage";
import LoginMethodStage from "./LoginMethodStage";
import { updateMyEmail } from "../../api/endpoints";

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onLogin?: (me: User) => void;
    oauthToUri?: string;
    emailUpdateMode?: boolean;
};

export default function AuthModal({ isOpen, onClose, onLogin, oauthToUri, emailUpdateMode }: LoginModalProps) {
    const [stage, setStage] = useState<'method' | 'email' | 'verification'>(emailUpdateMode ? 'email' : 'method');
    const [email, setEmail] = useState<string>('');
    const [verification, setVerification] = useState<EmailVerification | null>();
    const [isNewUser, setIsNewUser] = useState<boolean>(false);

    const location = useLocation();

    const {
        checkEmailMutation,
        requestEmailVerificationMutation,
        loginMutation
    } = useLoginMutations();
    const updateEmailMutation = useMutation({ mutationFn: updateMyEmail });
    const queryClient = useQueryClient();

    const { colorMode } = useColorMode();
    const { toastInfo, toastError, toastSuccess } = useGeneralToasts();

    const reset = () => {
        setStage(emailUpdateMode ? 'email' : 'method');
        setEmail('');
        setVerification(null);
        setIsNewUser(false);
    };

    const handleError = (error: unknown) => {
        if (!isAxiosError(error)) throw error;

        let description;
        if (error.response) {
            const { code, message } = error.response.data;
            description = `${code}: ${message}`;
        } else {
            description = error.message;
        }

        toastError('오류가 발생했습니다', description);
    };

    const handleSubmitMethod = async (method: string) => {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

        const toUri = oauthToUri ? oauthToUri : (location.pathname + location.hash);

        const redirectUri = `${baseUrl}/oauth`;

        const state = JSON.stringify({ toUri, provider: method });

        if (method === 'email') {
            setStage('email');
            return;
        }

        reset();
        onClose();

        if (method === 'github') {
            window.location.replace(
                'https://github.com/login/oauth/authorize'
                + `?client_id=${GITHUB_OAUTH_CLIENT_ID}`
                + `&scope=read:user,user:email`
                + `&redirect_uri=${encodeURIComponent(redirectUri)}`
                + `&state=${encodeURIComponent(state)}`
            );
        } else if (method === 'discord') {
            window.location.replace(
                'https://discord.com/oauth2/authorize'
                + `?response_type=code`
                + `&client_id=${DISCORD_OAUTH_CLIENT_ID}`
                + `&scope=identify+email`
                + `&redirect_uri=${encodeURIComponent(redirectUri)}`
                + `&state=${encodeURIComponent(state)}`
            );
        }
    };

    const handleSubmitEmail = async (email: string): Promise<string | undefined> => {
        try {
            setEmail(email);

            const emailExists = await checkEmailMutation.mutateAsync(email);
            setIsNewUser(!emailExists);

            if (emailExists && emailUpdateMode) {
                return '이미 연결된 계정이 존재하는 이메일입니다.';
            }

            const verification = await requestEmailVerificationMutation.mutateAsync(email);
            setVerification(verification);
            setStage('verification');   
        } catch (e) {
            handleError(e);
        }
    };

    const handleResendVerificationCode = async () => {
        try {
            setEmail(email);
            const verification = await requestEmailVerificationMutation.mutateAsync(email);
            setVerification(verification);
        } catch (e) {
            handleError(e);
        }
    };

    const handleSubmitVerificationCode = async (code: string): Promise<boolean> => {
        try {
            if (!emailUpdateMode) {
                const user = await loginMutation.mutateAsync({
                    verificationId: verification!.verificationId,
                    email,
                    code
                });

                queryClient.setQueryData(['me'], user);
                await queryClient.invalidateQueries({ queryKey: ['payments'] });

                toastSuccess(`${isNewUser ? '가입 및 ' : ''}로그인 완료`, user.displayName);

                reset();
                onClose();
                if (onLogin) onLogin(user);                
            } else {
                await updateEmailMutation.mutateAsync({
                    verificationId: verification!.verificationId,
                    email,
                    code
                });

                await queryClient.setQueryData(['me'], (me: User) => {
                    if (!me) return;

                    return {
                        ...me,
                        email
                    };
                });

                toastSuccess(`이메일 변경 완료`, email);

                reset();
                onClose();
            }
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                const { code } = e.response.data;

                if (code === 'AUTH_VERIFICATION_NOT_FOUND') {
                    toastInfo('인증이 만료되었습니다', '인증을 다시 시도해주세요');
                    setStage('email');
                    return false;
                } else if (code === 'AUTH_EMAIL_VERIFICATION_LIMIT_EXCEEDED') {
                    toastInfo('인증코드 최대 시도횟수를 초과했습니다', '인증을 다시 시도해주세요');
                    setStage('email');
                    return false;
                } else if (code === 'AUTH_INVALID_EMAIL_VERIFICATION_CODE') {
                    return false;
                }
            }

            handleError(e);
            return false;
        }

        return true;
    };

    let stageNode;

    if (stage === "method") {
        stageNode = (
            <LoginMethodStage
                onSubmit={handleSubmitMethod}
            />
        );
    } else if (stage === "email") {
        stageNode = (
            <EmailInputStage
                initialEmail={email}
                onPrev={() => {
                    reset();                    
                    if (emailUpdateMode) onClose();
                }}
                onSubmit={handleSubmitEmail}
                emailUpdateMode={emailUpdateMode}
            />
        );
    } else if (stage === "verification") {
        stageNode = (
            <VerificationStage
                email={email}
                onPrev={() => setStage('email')}
                onResend={handleResendVerificationCode}
                onSubmit={handleSubmitVerificationCode}
            />
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                reset();
                onClose();
            }}
            closeOnOverlayClick={stage !== 'verification'}
            size={{ base: 'full', md: 'md' }}
        >
            <ModalOverlay display={{ base: 'none', md: 'block' }} />
            <ModalContent
                bg={colorMode === 'light' ? '#fafafa' : '#171923'}
                backdropFilter="blur(15px)"
            >
                <ModalHeader>
                    {emailUpdateMode ? '이메일 변경' : '가입 및 로그인'}
                </ModalHeader>
                {stageNode}
            </ModalContent>
        </Modal>
    );
}
