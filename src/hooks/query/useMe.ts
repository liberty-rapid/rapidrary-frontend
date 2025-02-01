import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../../api/endpoints";

export const useMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        staleTime: 3 * 60 * 1000,
        gcTime: 5 * 60 * 1000
    });
};
