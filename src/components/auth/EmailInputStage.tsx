import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Input,
    ModalBody,
    ModalCloseButton,
    HStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    ModalFooter,
    useBoolean
} from "@chakra-ui/react";

type EmailInputStageProps = {
    initialEmail: string;
    onPrev: () => void;
    onSubmit: (email: string) => Promise<string | undefined>;
    emailUpdateMode?: boolean;
};

export default function EmailInputStage({ initialEmail, onPrev, onSubmit, emailUpdateMode }: EmailInputStageProps) {
    const [email, setEmail] = useState(initialEmail);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useBoolean();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => inputRef.current?.focus(), []);

    const isEmailValid = email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    );

    const handleSubmit = async () => {
        if (!isEmailValid) {
            setEmailError("이메일의 형식을 확인해주세요");
        } else {
            setIsLoading.on();
            await new Promise(resolve => setTimeout(resolve, 200));

            const error = await onSubmit(email);
            if (error) {
                setEmailError(error);
            }

            setIsLoading.off();
        }
    };

    return (
        <>
            <ModalCloseButton />
            <ModalBody>
                <FormControl
                    isInvalid={(email !== "" && !isEmailValid) || emailError !== null}
                >
                    <Box height="256px">
                        <FormLabel fontSize="18px">
                            {emailUpdateMode ? '새' : ''} 이메일을 입력해주세요
                        </FormLabel>
                        <Input
                            ref={inputRef}
                            value={email}
                            height="50px"
                            placeholder="이메일"
                            onChange={(event) => {
                                setEmailError(null);
                                setEmail(event.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />
                        {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </Box>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <HStack spacing="8px">
                    <Button
                        colorScheme="blue"
                        variant="ghost"
                        size="lg"
                        onClick={onPrev}
                    >
                        {emailUpdateMode ? '취소' : '이전'}
                    </Button>
                    <Button
                        colorScheme="blue"
                        size="lg"
                        isLoading={isLoading}
                        onClick={handleSubmit}
                    >
                        다음
                    </Button>
                </HStack>
            </ModalFooter>
        </>
    );
}
