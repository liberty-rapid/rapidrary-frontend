import {
    Text,
    Flex,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerCloseButton,
    DrawerBody,
    useColorModeValue
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import TableOfContents from "./TableOfContents";
import { useEffect, useState } from "react";
import { Book } from "../../api/apiTypes";
import queryClient from "../../queryClient";
import { fetchBook } from "../../api/endpoints";

type TOCDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    isNotPurchasedBook?: boolean;
};

export default function TOCDrawer({ isOpen, onClose, isNotPurchasedBook }: TOCDrawerProps) {
    const params = useParams();
    const [book, setBook] = useState<Book | null>();
    const bg = useColorModeValue("white", "gray.900");

    useEffect(() => {
        let cancel = false;

        async function queryBook() {
            if (params.bookId) {
                const book = await queryClient.fetchQuery({
                    queryFn: () => fetchBook(params.bookId!),
                    queryKey: ['book', params.bookId],
                    staleTime: 5 * 60 * 1000,
                    gcTime: 5 * 60 * 1000
                });

                if (!cancel) setBook(book);
            }            
        }

        queryBook();
        return () => {
            cancel = true;
        };
    }, [params]);

    return (
        <Drawer size="xs" isOpen={isOpen} onClose={onClose} placement="left">
            <DrawerContent bgColor={bg} motionProps={{
                variants: {
                    enter: {
                        x: "0%",
                        transition: { duration: 0.225 },
                    },
                    exit: {
                        x: "-100%",
                        transition: { duration: 0.1 },
                    },
                },
            }}>
                <DrawerHeader>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="0.95rem">{book?.title}</Text>
                        <DrawerCloseButton position="static" />
                    </Flex>
                </DrawerHeader>
                <DrawerBody pt={0} pb={3} pl={book?.index.some(content => typeof content === 'string') ? 4 : 2}>
                    {(params.bookId && params['*'] && book) && (
                        <TableOfContents
                            book={book}
                            file={params['*']}
                            onClose={onClose}
                            isNotPurchasedBook={Boolean(isNotPurchasedBook)}
                        />
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
