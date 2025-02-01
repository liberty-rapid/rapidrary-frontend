import { useState } from "react";
import { useBooks } from "../hooks/query/useBooks";

import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

import { useTranslation } from "react-i18next";

import BookTagSelector from "../components/book/BookTagSelector";
import Books from "../components/book/Books";

export default function Home() {
    const { t } = useTranslation('common');

    const [tag, setTag] = useState<string>('');

    const { data: books } = useBooks();

    if (!books) {
        return (
            <Box p="24px 15px 15px 15px">
                <Stack alignItems="center" spacing={6}>
                    <BookTagSelector
                        tag={tag}
                        setTag={setTag}
                    />
                    <Stack spacing={3}>
                        <Skeleton height={{ base: '120px', sm: '200px' }} />
                        <Skeleton height={{ base: '120px', sm: '200px' }} />
                        <Skeleton height={{ base: '120px', sm: '200px' }} />
                    </Stack>
                </Stack>
            </Box>
        );
    }

    const filteredBooks = tag === '' ? books : books.filter(book => book.tags.includes(tag));

    return (
        <>
            <Helmet><title>{t("home")} | Rapidrary</title></Helmet>
            <Box p="24px 15px 15px 15px">
                <Stack alignItems="center" spacing={6}>
                    <BookTagSelector
                        tag={tag}
                        setTag={setTag}
                    />
                    <Box width={{ base: '100%', lg: '1000px' }}>
                        <Books books={filteredBooks}/>
                    </Box>
                </Stack>
            </Box>
        </>
    );
}
