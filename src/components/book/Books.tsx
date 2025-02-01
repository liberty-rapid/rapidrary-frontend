import { Box } from "@chakra-ui/react";

import { Book } from "../../api/apiTypes";
import { useMe } from "../../hooks/query/useMe";

import BookCardList from "./BookCardList";
import { useTranslation } from "react-i18next";

type BooksProps = {
    books: Book[]
};

export default function Books({ books }: BooksProps) {
    const { i18n } = useTranslation();

    const { data: me } = useMe();

    const filteredBooks = books.filter(book => !book.hidden && book.language == i18n.language);

    function compareBooks(a: Book, b: Book) {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;        

        const tagCompareResult = a.tags[0].localeCompare(b.tags[0]);
        if (tagCompareResult !== 0) return tagCompareResult;
    
        if (a.price === 0 && b.price !== 0) return -1;
        if (a.price !== 0 && b.price === 0) return 1;
    
        return a.title.localeCompare(b.title);
    }

    const sortedBooks = !me
        ? filteredBooks.sort(compareBooks)
        : filteredBooks
            .filter(book => me.books.indexOf(book.id) !== -1 || book.pinned)
            .sort(compareBooks)
            .concat(
                filteredBooks
                    .filter(book => me.books.indexOf(book.id) === -1 && !book.pinned)
                    .sort(compareBooks)
            );

    return (
        <Box width="100%">
            {filteredBooks && (
                <BookCardList
                    books={sortedBooks}
                />
            )}
        </Box>
    );
}
