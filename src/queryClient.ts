import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (isAxiosError(error) && error.response) {
                    if (error.response.status.toString().startsWith('4')) {
                        return false;
                    }
                }

                return failureCount < 3;
            }
        },
    },
});

export default queryClient;
