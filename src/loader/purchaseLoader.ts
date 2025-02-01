import { isAxiosError } from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

import queryClient from "../queryClient";
import { fetchBook } from "../api/endpoints";
import { Book } from "../api/apiTypes";

export interface PurchaseLoaderData {
    book: Book;
}

export const purchaseLoader = async ({ request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;

    if (!searchParams.has('bookId')) {
        throw new Response("Bad Request", { status: 400 });
    }

    const bookId = searchParams.get('bookId')!;

    try {
        const book = await queryClient.fetchQuery({
            queryKey: ['book', bookId],
            queryFn: () => fetchBook(bookId),
            staleTime: 5 * 60 * 1000
        });

        return { book };
    } catch (e) {
        if (isAxiosError(e) && e.response) {
            if (e.response.status === 404) {
                throw new Response("Bad Request", { status: 400 });
            }
        }

        throw e;
    }
};
