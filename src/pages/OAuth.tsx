import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner, Stack, Text } from "@chakra-ui/react";

import { signInByOAuth } from "../api/endpoints";
import { useGeneralToasts } from "../hooks/useGeneralToast";

export default function OAuth() {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const { toastSuccess, toastInfo, toastError } = useGeneralToasts();

    const navigate = useNavigate();

    useEffect(() => {
        const invalidAccess = () => {
            toastInfo('잘못된 접근입니다', '홈으로 이동했습니다.');
            navigate('/', { replace: true });
        };

        const signIn = async () => {
            if (!searchParams.has('state') || !searchParams.has('code')) {
                invalidAccess();
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let state: any;
            try {
                state = JSON.parse(searchParams.get("state")!);
            } catch {
                invalidAccess();
                return;
            }

            const provider = state['provider'];

            try {
                const url = new URL(window.location.href);
                const baseUrl = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}${url.pathname}`;

                const user = await signInByOAuth({
                    provider,
                    authorizationCode: searchParams.get('code')!,
                    redirectUrl: baseUrl
                });

                queryClient.setQueryData(['me'], user);
        
                if (state['toUri']) {
                    navigate(state['toUri'], { replace: true });
                }

                const isNewUser = new Date().getTime() - new Date(user.createdAt).getTime() <= 5000;
                toastSuccess(`${isNewUser ? '가입 및 ' : ''}로그인 완료`, user.displayName);
            } catch (e) {
                if (isAxiosError(e) && e.response) {
                    if (e.response.status === 400 || e.response.status === 401) {
                        toastError('로그인에 실패했습니다', e.response.data.code);
                        navigate('/', { replace: true });
                        return;
                    }
                }
        
                throw e;
            }
        };

        signIn();
    }, [navigate, queryClient, searchParams, toastError, toastInfo, toastSuccess]);

    return (
        <Stack width="100%" mt="20vh" align="center" spacing={8}>
            <Helmet><title>로그인 중 | Rapidrary</title></Helmet>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
            />
            <Text fontSize="1rem" fontWeight="bold">로그인 중...</Text>        
        </Stack>
    );
}
