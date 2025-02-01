import {
    Button,
    ModalBody,
    ModalCloseButton,
    Stack,
    Image,
    Link,
    Text,
    useColorMode
} from "@chakra-ui/react";
import { IoMail } from "react-icons/io5";
import { RiDiscordFill, RiGithubFill } from "react-icons/ri";

import logoWhite from "../../assets/images/icon-only-logo-white.svg";
import logoBlack from "../../assets/images/icon-only-logo-black.svg";

type LoginMethodStageProps = {
    onSubmit: (method: 'email' | 'github' | 'discord') => void;
};

export default function LoginMethodStage({ onSubmit }: LoginMethodStageProps) {
    const { colorMode } = useColorMode();

    return (
        <>
            <ModalCloseButton />
            <ModalBody>
                <Stack height="336px">
                    <Stack justifyContent="center" flexGrow={1}>
                        <Image
                            height="48px"
                            src={colorMode === 'light' ? logoBlack : logoWhite}
                        />
                    </Stack>
                    <Button
                        variant={colorMode === 'dark' ? 'solid' : 'outline'}
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        height="48px"
                        leftIcon={<RiGithubFill size="32px" />}
                        onClick={() => onSubmit('github')}
                    >
                        Github로 로그인
                    </Button>
                    <Button
                        variant={colorMode === 'dark' ? 'solid' : 'outline'}
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        height="48px"
                        leftIcon={<RiDiscordFill size="32px" />}
                        onClick={() => onSubmit('discord')}
                    >
                        Discord로 로그인
                    </Button>
                    <Button
                        variant={colorMode === 'dark' ? 'solid' : 'outline'}
                        boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                        height="48px"
                        leftIcon={<IoMail size="32px" />}
                        iconSpacing={2}
                        onClick={() => onSubmit('email')}
                    >
                        이메일 인증으로 로그인
                    </Button>
                    <Text
                        my={4}
                        textAlign="center"
                        fontSize="12px"
                        color={colorMode === 'light' ? '#808080' : '#808080'}
                        whiteSpace="normal"
                        wordBreak="keep-all"
                    >
                        최초 로그인(가입) 시, <Link
                            href="/info/terms_of_use.html"
                            target="_blank"
                            color="#5A9BD8"
                            fontWeight="bold"
                        >
                            이용약관
                        </Link>과 <Link
                            href="/info/privacy_policy.html"
                            target="_blank"
                            color="#5A9BD8"
                            fontWeight="bold"
                        >
                            개인정보처리방침
                        </Link>에 동의하는 것으로 간주됩니다.
                    </Text>
                </Stack>
            </ModalBody>
        </>
    );
}
