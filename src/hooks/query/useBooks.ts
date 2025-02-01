import { useQuery } from "@tanstack/react-query";

import { fetchBook, fetchBooks } from "../../api/endpoints";

export const useBooks = () => {
    return useQuery({
        queryKey: ["books"],
        queryFn: () => fetchBooks(),
        staleTime: 5 * 60 * 1000
    });
};

export const useBook = (bookId: string) => {
    return useQuery({
        queryKey: ["book", bookId],
        queryFn: () => fetchBook(bookId),
        staleTime: 5 * 60 * 1000
    });
};
