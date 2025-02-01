import path from 'path-browserify';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    HStack,
    Text,
    Tag,
    Card,
    CardBody,
    Image,
    useColorModeValue,
    useBreakpointValue
} from "@chakra-ui/react";

import { Book } from "../../api/apiTypes";
import { useMe } from '../../hooks/query/useMe';
import { getNextContent } from '../../utils/book-helper';

import bookCoverFallback from '../../assets/images/book-cover-fallback.png';

type BookCardProps = {
    book: Book;
};

export default function BookCard({ book }: BookCardProps) {
    const { data: me } = useMe();

    const navigate = useNavigate();

    const bg = useColorModeValue("white", "gray.900");
    const hoverBg = useColorModeValue("#f7f7f7", "gray.800");
    const activeBg = useColorModeValue("#f7f7f7", "gray.800");
    const isMobileSize = useBreakpointValue({ base: true, sm: false }, { ssr: false });

    const isPurchased = Boolean(me && me.books.includes(book.id));
    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: book.currency
    }).format(book.price);

    const firstContent = getNextContent(book);

    const onBookCardClick = async () => {
        if (book.price !== 0) {
            if (!me?.books.includes(book.id)) {
                const firstPreviewContent = getNextContent(book, undefined, true);

                if (firstPreviewContent !== null) {
                    navigate(`/${book.id}/${firstPreviewContent.file}`);
                }
            }
        }

        if (firstContent !== null) {
            navigate(`/${book.id}/${firstContent.file}`);
        }
    };

    return (
        <Card
            direction="row"
            variant="outline"
            overflow="hidden"
            bg={bg}
            _active={{ bg: activeBg }}
            _hover={{ bg: hoverBg }}
            onClick={onBookCardClick}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
        >
            <a
                href={`/${book.id}/${firstContent!.file}`}
                role="button"
                style={{ display: 'flex', width: '100%' }}
                onClick={event => {
                    event.preventDefault();
                }}
            >
                <Image
                    objectFit="cover"
                    background="none"
                    w={{ base: '120px', sm: '200px' }}
                    h={{ base: '120px', sm: '200px' }}
                    src={book.coverImage ? path.join(`/api/v1/books/${book.id}/`, book.coverImage) : bookCoverFallback}
                    alt="Book Cover"
                />
                <CardBody position="relative" p={ isMobileSize ? '16px' : undefined }>
                    <Box width="100%" minHeight={{ base: '80px', sm: 'auto'}}>
                        <Text fontWeight="bold" fontSize={{ base: '13px', sm: '16px' }}>{book.title}</Text>
                        <HStack
                            ml="-1px"
                            mt="8px"
                            spacing={ isMobileSize ? 1 : 2 }
                        >
                            {book.price !== 0 && (
                                !isPurchased && (
                                    <Tag size={ isMobileSize ? 'sm' : 'md' } colorScheme="purple">유료</Tag>
                                )
                            )}
                            {book.tags.map(tag => (
                                <Tag key={tag} size={ isMobileSize ? 'sm' : 'md' } colorScheme="blue">#{tag}</Tag>
                            ))}
                        </HStack>
                    </Box>
                    <Text
                        display={{ base: 'none', sm: 'block' }}
                        fontSize="1rem"
                        py="2"
                    >
                        {book.description}
                    </Text>
                    {(book.price !== 0 && !isPurchased) && (                           
                        <Text
                            position="absolute"
                            right="16px"
                            bottom="10px"
                            fontSize={ isMobileSize ? "1rem" : "1.125rem" }
                            fontWeight="bold"
                        >
                            {formattedPrice}
                        </Text>
                    )}                    
                </CardBody>                
            </a>
        </Card>
    );
}
