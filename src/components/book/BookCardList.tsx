import { Stack, Box } from "@chakra-ui/react";

import { Book } from "../../api/apiTypes";

import BookCard from "./BookCard";

type BookListProps = {
    books: Book[];
};

export default function BookCardList({ books }: BookListProps) {
    return (
        <Stack width="100%" spacing={3}>
            {books.map(book => (
                <Box key={book.id} as="button" textAlign="left" width="100%">
                    <BookCard book={book} />                    
                </Box>
            ))}
        </Stack>
    );
}
