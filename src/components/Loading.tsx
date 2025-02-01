import { Stack, Text, CircularProgress } from "@chakra-ui/react";

type LoadingProps = {
    message?: string
};

export default function Loading({ message }: LoadingProps) {
    return (
        <Stack width="100%" align="center" spacing={8}>
            <CircularProgress size="64px" color="cyan.400" isIndeterminate />
            {message && <Text fontSize="1rem" fontWeight="bold">{message}</Text>}
        </Stack>
    );
}
