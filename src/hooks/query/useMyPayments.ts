import { useQuery } from "@tanstack/react-query";
import { fetchMyPayments } from "../../api/endpoints";

export const useMyPayments = () => {
    return useQuery({
        queryKey: ['payments'],
        queryFn: fetchMyPayments
    });
};
