import path from "path-browserify";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Stack,
    Text,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useBreakpointValue,
    useDisclosure,
    Flex,
    Image,
    HStack,
    Tag,
    useColorMode
} from "@chakra-ui/react";
import { RiLoginBoxLine } from "react-icons/ri";

import { Book, User } from "../../api/apiTypes";
import { useMe } from "../../hooks/query/useMe";
import { useGeneralToasts } from "../../hooks/useGeneralToast";

import AuthModal from "../auth/AuthModal";

import bookCoverFallback from '../../assets/images/book-cover-fallback.png';

type Props = {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
};

export default function PaidBookModal({ book, isOpen, onClose }: Props) {
    const { data: me } = useMe();

    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const modalSize = useBreakpointValue({ base: 'full', md: 'md' }, { ssr: false });

    const loginDisclosure = useDisclosure();

    const { toastInfo } = useGeneralToasts();
    
    const handleBuyButtonClick = async () => {
        if (me) {
            onClose();
            navigate(`/purchase?bookId=${book.id}`);
        } else {
            onClose();
            await new Promise(resolve => setTimeout(resolve, 250));
            loginDisclosure.onOpen();
        }
    };

    const onLoginToPurchase = (me: User) => {
        if (me.books.includes(book.id)) {
            toastInfo('이미 이 콘텐츠를 보유중입니다.');
        } else {
            navigate(`/purchase?bookId=${book.id}`);             
        }
    };

    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: book.currency
    }).format(book.price);

    return (
        <>
            <AuthModal
                isOpen={loginDisclosure.isOpen}
                onClose={loginDisclosure.onClose}
                onLogin={onLoginToPurchase}
                oauthToUri={`/purchase?bookId=${book.id}`}
            />
            <Modal
                colorScheme="black"
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={true}
                size={modalSize}
                motionPreset="slideInTop"
            >
                <ModalOverlay />
                <ModalContent
                    bg={colorMode === 'light' ? '#fafafa' : '#171923cc'}
                    backdropFilter={{ base: "blur(5px)", md: "blur(10px)" }}
                >
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody overflow="hidden">
                        <Flex
                            direction="column"
                            minHeight="460px"
                            width="100%"
                            mb={4}
                        >
                            <Image
                                objectFit="contain"
                                width="100%"
                                height="225px"
                                minHeight="225px"
                                borderRadius="4px"                            
                                src={book.coverImage ? path.join(`/api/v1/books/${book.id}/`, book.coverImage) : bookCoverFallback}
                                alt="Book Cover"
                            />
                            <Text mt="12px" mx="1px" fontSize="1.1rem" fontWeight="bold">{book.title}</Text>
                            <HStack mt="8px" spacing={2}>
                                {book.tags.map(tag => (
                                    <Tag key={tag} colorScheme="blue" userSelect="none">#{tag}</Tag>
                                ))}                                
                            </HStack>
                            <Text mx="1px" mt="8px" fontSize={{ base: '0.9rem', md: '1rem' }}>
                                {book.description}
                            </Text>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Stack align="end" spacing={2}>
                            <Box>
                                <Text fontSize={{ base: '1.25rem', md: '1.5rem' }} fontWeight="bold">
                                    {formattedPrice}
                                </Text>                                                
                            </Box>
                            <HStack spacing={2}>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    visibility={{ base: 'visible', md: 'hidden' }}
                                    colorScheme="blue"
                                    onClick={onClose}
                                >
                                    닫기
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    rightIcon={!me ? <RiLoginBoxLine /> : undefined}
                                    onClick={handleBuyButtonClick}
                                >
                                    구매하기
                                </Button>
                            </HStack>
                        </Stack>
                    </ModalFooter>
                </ModalContent>
            </Modal>        
        </>
    );
}
