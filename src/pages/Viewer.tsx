import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import useLocalStorageState from 'use-local-storage-state';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Box, Stack, Flex, useColorModeValue, IconButton, useBreakpointValue, useColorMode, useDisclosure } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoListSharp } from 'react-icons/io5';

import { getContentByFile, getNextContent, getPrevContent } from '../utils/book-helper';
import { ViewerLoaderData } from '../loader/viewerLoader';
import { useMe } from '../hooks/query/useMe';
import { useScrollTop } from '../hooks/useScrollTop';

import Header from '../components/Header';
import TableOfContents from '../components/book/TableOfContents';
import TOCDrawer from '../components/book/TOCDrawer';
import Content from '../components/viewer/Content';

import '../assets/styles/util.css';

let prevScrollTop = 0;

export default function Viewer() {
    const { data: me } = useMe();
    const { book, file } = useLoaderData() as ViewerLoaderData;
    const [tocExpanded, setTocExpanded] = useLocalStorageState<boolean>('tocExpanded', {
        defaultValue: true
    });

    const [mouseOnHeader, setMouseOnHeader] = useState(false);

    const headerRef = useRef<HTMLDivElement | null>(null);
    const scrollTop = useScrollTop();

    const tocDrawerDisclosure = useDisclosure();

    const isMobileSize = useBreakpointValue({ base: true, xl: false }, { ssr: false });
    const { colorMode } = useColorMode();
    const color = useColorModeValue('#303030', '#d0d0d0');
    const arrowColor = useColorModeValue('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.6)');
    const iconColor = useColorModeValue("#444444", "#bbbbbb");

    const navigate = useNavigate();

    useEffect(() => {
        prevScrollTop = 0;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;

            if (!headerRef.current) {
                prevScrollTop = scrollTop;
                return;
            }

            const headerTop = Number(headerRef.current.style.top.replace('px', ''));
            const isHeaderSticky = headerRef.current.style.position === 'sticky';

            if (scrollTop < prevScrollTop) {
                if (!isHeaderSticky) {
                    if (headerTop < scrollTop - 128) {
                        headerRef.current.style.top = `${scrollTop - 128}px`;
                        headerRef.current.style.position = 'relative';
                    } else if (scrollTop <= headerTop) {
                        headerRef.current.style.top = '0';
                        headerRef.current.style.position = 'sticky';
                    }
                }
            } else if (scrollTop > prevScrollTop) {
                if (isHeaderSticky) {
                    headerRef.current.style.top = `${prevScrollTop}px`;
                    headerRef.current.style.position = 'relative';
                }
            }

            prevScrollTop = scrollTop;
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isNotPurchasedBook = book.price !== 0 && !me?.books.includes(book.id);

    useEffect(() => {
        if (isNotPurchasedBook && !getContentByFile(book, file)?.isPreview) {
            navigate('/', { replace: true });
        }
    }, [book, file, isNotPurchasedBook, navigate]);

    const handleBackwardButtonClick = () => {
        navigate(`/${book.id}/${getPrevContent(book, file, isNotPurchasedBook)!.file}`);
    };

    const handleForwardButtonClick = () => {
        navigate(`/${book.id}/${getNextContent(book, file, isNotPurchasedBook)!.file}`);
    };

    const arrowButton = (isBackward: boolean) => {
        const targetContent = isBackward ? getPrevContent(book, file) : getNextContent(book, file);
        const isDisabled = targetContent !== null && isNotPurchasedBook && !(targetContent?.isPreview);
        const icon = isBackward
            ? <IoIosArrowBack size="32px" color={arrowColor} />
            : <IoIosArrowForward size="32px" color={arrowColor} />;

        return (
            <IconButton
                key={isMobileSize ? (file + (isBackward ? '-back' : '-forward')) : undefined}
                position={isMobileSize ? "static" : "sticky"}
                top="calc(50% - 48px)"
                visibility={targetContent !== null ? 'visible' : 'hidden'}
                isDisabled={isDisabled}
                mx={isMobileSize ? 0 : 4}
                variant={isMobileSize ? "outline" : "ghost"}
                boxSize="96px"
                icon={icon}
                boxShadow={isMobileSize && colorMode === 'light'
                    ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                    : undefined
                }
                aria-label={isBackward ? '이전' : '다음'}
                title={isBackward ? '이전' : '다음'}
                onClick={isBackward ? handleBackwardButtonClick : handleForwardButtonClick}
            />
        );
    };

    return (
        <Flex width="100%">
            <Helmet>
                <title>{getContentByFile(book, file)?.title} - {book.title} | Rapidrary</title>
            </Helmet>
            <TOCDrawer
                isOpen={tocDrawerDisclosure.isOpen}
                onClose={tocDrawerDisclosure.onClose}
                isNotPurchasedBook={isNotPurchasedBook}
            />
            {!isMobileSize && (
                <Stack
                    position="sticky"
                    top="0"
                    w="280px"
                    minW="280px"
                    h="100vh"
                    transform={tocExpanded ? 'translateX(0px)' : 'translateX(-280px)'}
                    mr={tocExpanded ? '0px' : '-280px'}
                    backgroundColor={colorMode === 'light' ? '#efefef' : '#202632'}
                    transition="margin-right 0.25s ease, transform 0.25s ease"
                    spacing={0}
                    overflowY="scroll"
                    overscrollBehavior="none"
                >
                    <Box
                        position="sticky"
                        top="0"
                        zIndex={99999}
                        backgroundColor={colorMode === 'light' ? '#efefefd0' : '#202632d0'}
                        backdropFilter={book ? 'blur(10px)' : undefined}
                    >
                        <IconButton
                            boxSize="40px"
                            my={3}
                            ml={3}
                            variant="ghost"
                            icon={<IoListSharp color={iconColor} size="21px" />}
                            onClick={() => isMobileSize ? tocDrawerDisclosure.onClose() : setTocExpanded(false)}
                            aria-label="목차"
                            title="목차"
                        />
                    </Box>
                    <Box pl={2}>
                        <TableOfContents book={book} file={file} isNotPurchasedBook={isNotPurchasedBook} />
                    </Box>
                </Stack>                
            )}
            <Box
                position="relative"
                flexGrow={1}
            >
                <Box
                    position="sticky"
                    top="0"
                    w="100%"
                    h="0px"
                >
                    <Box
                        w="100%"
                        h="64px"
                        onMouseEnter={e => {
                            if (e.buttons === 0) setMouseOnHeader(true);
                            e.stopPropagation();
                        }}
                        onMouseMove={e => e.stopPropagation()}
                    />
                </Box>
                <Stack
                    alignItems="center"
                    flexGrow={1}
                    minH='100vh'
                >
                    <Stack
                        ref={headerRef}
                        visibility="visible"
                        position="sticky"
                        spacing={0}
                        width="100%"
                        zIndex={999}
                        className={(tocExpanded || mouseOnHeader) ? 'forced-sticky-top' : undefined}
                    >
                        <Header
                            book={book}
                            toggleTOC={() => isMobileSize ? tocDrawerDisclosure.onToggle() : setTocExpanded(!tocExpanded)}
                            isTOCOpen={isMobileSize ? tocDrawerDisclosure.isOpen : tocExpanded}
                        />
                        {scrollTop !== 0 && (
                            <Box
                                width="100%"
                                borderBottom={`1px solid ${colorMode === 'dark' ? '#1f212b' : '#eeeeee'}`}
                            />
                        )}
                    </Stack>
                    <Flex
                        width="100%"
                        justifyContent={isMobileSize ? "center" : "space-between"}
                        color={color}
                        onMouseMove={() => setMouseOnHeader(false)}              
                    >
                        {!isMobileSize && arrowButton(true)}
                        <Box
                            px={4}
                            pb={isMobileSize ? 6 : 16}
                            w={{ base: "100%", md: "800px" }}
                            minH="calc(100vh - 96px)"
                            className={colorMode === 'light' ? 'light-theme' : 'dark-theme'}
                        >
                            <Content book={book} file={file} />
                            {isMobileSize && (
                                <Box mt={8}>
                                    <Flex width="100%" justifyContent="space-between">
                                        {arrowButton(true)}
                                        {arrowButton(false)}
                                    </Flex>
                                </Box>
                            )}
                        </Box>
                        {!isMobileSize && arrowButton(false)}
                    </Flex>
                </Stack>
            </Box>
        </Flex>
    );
}
