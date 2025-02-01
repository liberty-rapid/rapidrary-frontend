import { useQuery } from "@tanstack/react-query";

import { fetchBookFile } from "../../api/endpoints";

export const useBookFile = (bookId: string, file: string) => {
    return useQuery({
        queryKey: ["bookFile", bookId, file],
        queryFn: () => fetchBookFile(bookId, file),
        staleTime: 5 * 60 * 1000
    });
};
