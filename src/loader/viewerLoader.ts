import { isAxiosError } from "axios";
import { LoaderFunctionArgs } from "react-router-dom";

import queryClient from "../queryClient";
import { fetchBook } from "../api/endpoints";
import bookUtils from "../utils/book-helper";
import { Book } from "../api/apiTypes";

export interface ViewerLoaderData {
    book: Book;
    file: string;
    content: string;
}

export const viewerLoader = async ({ params }: LoaderFunctionArgs) => {
    try {
        const book = await queryClient.fetchQuery({
            queryKey: ['book', params.bookId],
            queryFn: () => {
                return fetchBook(params.bookId!);
            },
            staleTime: 5 * 60 * 1000
        });

        let file = params['*'];
        if (!file || file === '') {
            const firstContent = bookUtils.getNextContent(book);

            if (!firstContent)
                throw new Response("Not Found", { status: 404 });

            file = firstContent.file;
        }

        if (bookUtils.getContentByFile(book, file) === null) {
            throw new Response("Not Found", { status: 404 });
        }

        return { book, file };
    } catch (e) {
        if (isAxiosError(e) && e.response) {
            if (e.response.status === 404) {
                throw new Response("Not Found", { status: 404 });
            } else if (e.response.status === 403) {
                throw new Response("Forbidden", { status: 403 });
            }
        }

        throw e;
    } 
};
