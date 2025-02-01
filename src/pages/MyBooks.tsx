import { Helmet } from "react-helmet";
import { Text, Box, Flex, Stack } from "@chakra-ui/react";
import { RiBook2Fill, RiLoginBoxLine } from "react-icons/ri";

import { useMe } from "../hooks/query/useMe";
import { useBooks } from "../hooks/query/useBooks";

import Loading from "../components/Loading";
import Books from "../components/book/Books";
import SettingFrame from "../components/SettingFrame";

export default function MyBooks() {
    const { data: me, isLoading: isLoadingMe } = useMe();    
    const { data: books } = useBooks();

    if (!me && !isLoadingMe) {
        return (
            <SettingFrame>
                <Helmet><title>내 서재 | Rapidrary</title></Helmet>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="300px"
                >
                    <Stack align="center" spacing={4}>
                        <RiLoginBoxLine size="32px" />
                        <Text size="lg">로그인이 필요합니다.</Text>
                    </Stack>
                </Flex>
            </SettingFrame>
        );
    }

    if (!books) {
        return <Box mt="20vh"><Loading message="불러오는 중" /></Box>;
    }

    const filteredBooks = books.filter(book => me?.books.includes(book.id));

    if (filteredBooks.length === 0) {
        return (
            <SettingFrame>
                <Helmet><title>내 서재 | Rapidrary</title></Helmet>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="300px"
                >
                    <Stack align="center" spacing={4}>
                        <RiBook2Fill size="32px" />
                        <Text size="lg">구매한 콘텐츠가 없습니다.</Text>
                    </Stack>
                </Flex>
            </SettingFrame>
        );
    }

    return (
        <SettingFrame>
            <Helmet><title>내 서재 | Rapidrary</title></Helmet>
            <Books books={filteredBooks}/>
        </SettingFrame>
    );
}
