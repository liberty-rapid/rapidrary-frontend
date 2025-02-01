import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

export const useGeneralToasts = () => {
    const toast = useToast();

    const toastInfo = useCallback((title: string, description?: string, duration?: number) => {
        toast({
            title,
            description,
            status: 'info',
            duration: duration ?? 5000,
            isClosable: true
        });
    }, [toast]);

    const toastError = useCallback((title: string, description?: string, duration?: number) => {
        toast({
            title,
            description,
            status: 'error',
            duration: duration ?? 9000,
            isClosable: true
        });
    }, [toast]);

    const toastSuccess = useCallback((title: string, description?: string, duration?: number) => {
        toast({
            title,
            description,
            status: 'success',
            duration: duration ?? 4000,
            isClosable: true
        });
    }, [toast]);

    return { toastInfo, toastError, toastSuccess };
};
