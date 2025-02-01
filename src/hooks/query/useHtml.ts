import { useQuery } from "@tanstack/react-query";

export const useHtml = (url: string) => {
    return useQuery({
        queryKey: ["html", url],
        queryFn: () => fetch(url).then(res => res.text()),
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};
