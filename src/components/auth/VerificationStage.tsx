import { useState, useEffect, useRef } from "react";
import {
    Box,
    Text,
    Stack,    
    HStack,    
    Button,
    PinInput,
    PinInputField,    
    ModalBody,
    ModalFooter,    
    ModalCloseButton,
    FormControl,
    FormErrorMessage,
    Tooltip,  
    useBoolean,
    Tag
} from "@chakra-ui/react";

type Props = {
    email: string;
    onPrev: () => void;
    onResend: () => Promise<void>;
    onSubmit: (code: string) => Promise<boolean>;
};

export default function VerificationStage({ email, onPrev, onResend, onSubmit }: Props) {
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(0);
    const [isNextLoading, setIsNextLoading] = useBoolean();
    const [isResendLoading, setIsResendLoading] = useBoolean();

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => inputRef.current?.focus(), []);

    const handleSubmit = async (code: string) => {
        setIsNextLoading.on();
        await new Promise(resolve => setTimeout(resolve, 200));
        const isCorrect = await onSubmit(code);
        setIsNextLoading.off();

        if (!isCorrect) {
            setError('인증 코드를 확인해주세요');
            setCode('');
            inputRef.current?.focus();
        }
    };

    const handleResend = async () => {
        setIsResendLoading.on();
        await new Promise(resolve => setTimeout(resolve, 200));
        await onResend();
        setIsResendLoading.off();

        setCode('');
        setError('');
        inputRef.current?.focus();

        const resendTime = 10;
        setResendTimer(resendTime);

        for (let i = 0; i < resendTime; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setResendTimer(time => time - 1);
        }
    };

    return (
        <>
            <ModalCloseButton />
            <ModalBody>
                <FormControl
                    isInvalid={error !== null}
                >
                    <Box height="256px">
                        <Stack pt="32px" align="center">
                            <Stack alignItems="center">
                                <Tag variant="ghost" fontSize="0.85rem">
                                    {email}
                                </Tag>
                                <Text fontSize="1.1rem" fontWeight="500">
                                    이메일로 발송된 인증코드를 입력해주세요
                                </Text>
                            </Stack>
                            <Box>
                                <PinInput
                                    value={code}
                                    placeholder=""
                                    onChange={(value) => {
                                        setError(null);
                                        setCode(value);
                                        if (value.length === 6) {
                                            handleSubmit(value);                                            
                                        }
                                    }}
                                >
                                    <PinInputField mr="4px" ref={inputRef} />
                                    <PinInputField mr="4px" />
                                    <PinInputField mr="4px" />
                                    <PinInputField mr="4px" />
                                    <PinInputField mr="4px" onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(code);
                                        }
                                    }} />
                                    <PinInputField />
                                </PinInput>                                
                            </Box>
                        </Stack>
                        <Stack align="center">
                            <Box>{error && <FormErrorMessage>{error}</FormErrorMessage>}</Box>
                            <Button
                                colorScheme="gray"
                                variant="outline"
                                minWidth="4rem"
                                height="1.5rem"
                                fontSize="0.75rem"
                                isLoading={isResendLoading}
                                isDisabled={resendTimer !== 0}
                                onClick={handleResend}
                            >
                                {resendTimer === 0 ? '재전송' : '재전송됨'}
                            </Button>
                            <Tooltip label='이메일 주소를 잘못 입력하셨거나, 인증코드가 스팸 메일함에 있을 수 있습니다. 문제가 지속된다면 support@rapidrary.com으로 문의해주세요'>
                                <Button mt="32px" variant="link" fontSize="0.8rem">
                                    메일을 받지 못하셨나요?
                                </Button>
                            </Tooltip>
                        </Stack>
                    </Box>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <HStack spacing="8px">
                    <Button
                        colorScheme="blue"
                        variant="ghost"
                        size="lg"
                        onClick={() => {
                            setError(null);
                            onPrev();
                        }}
                    >
                        이전
                    </Button>
                    <Button
                        colorScheme="blue"
                        size="lg"
                        isLoading={isNextLoading}
                        onClick={() => handleSubmit(code)}
                    >
                        다음
                    </Button>
                </HStack>
            </ModalFooter>
        </>
    );
}
