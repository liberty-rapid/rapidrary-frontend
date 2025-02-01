import path from 'path-browserify';
import { useEffect, useRef } from 'react';
import { Stack, Text, useColorMode } from "@chakra-ui/react";
import { Link } from 'react-router-dom';

import { Book } from "../../api/apiTypes";

import "../../assets/styles/toc-link.css";

type TableOfContentsProps = {
    book: Book;
    file: string;
    disableLink?: boolean;
    isNotPurchasedBook?: boolean;
    onClose?: () => void;
}

export default function TableOfContents({ book, file, disableLink, isNotPurchasedBook, onClose }: TableOfContentsProps) {
    const targetRef = useRef<HTMLButtonElement>(null);

    const { colorMode } = useColorMode();

    const contents: {
        type: 'part' | 'chapter' | 'section',
        title: string,
        file?: string,
        isPreview?: boolean,
        isNumbered?: boolean
    }[] = [];

    for (const content of book.index) {
        if (typeof content === 'string') {
            contents.push({
                type: 'part',
                title: content
            });
        } else {
            contents.push({
                type: 'chapter',
                ...content
            });

            if (content.sections) {
                for (const section of content.sections) {
                    contents.push({
                        type: 'section',
                        ...section
                    });
                }
            }

        }
    }

    useEffect(() => {
        targetRef.current?.scrollIntoView();
    }, []);

    let index = 0;
    let sectionIndex = 0;
    let chapterIndex = 0;
    const nodes: React.ReactNode[] = [];

    for (const content of contents) {
        const isCurrentFile = content.type === 'part'
            ? false
            : (path.normalize(content.file!) === path.normalize(file));

        if (content.type === 'section') {
            if (content.isNumbered)
                sectionIndex++;
        } else if (content.type === 'chapter') {
            if (content.isNumbered) {
                sectionIndex = 0;                
                chapterIndex++;                
            }
        }

        if (content.type === 'part') {
            nodes.push((
                <Text
                    key={content.file}
                    ml={4}
                    mt={index === 0 ? 0 : 6}
                    mb={1.5}
                    fontSize="0.875rem"
                    fontWeight="bold"
                >
                    {content.title}
                </Text>
            ));
        } else {
            const isActive = isCurrentFile;
            const isDisabled = isNotPurchasedBook && !content.isPreview;

            const className = isActive
                ? `active-${colorMode}-link`
                : (isDisabled ? `disabled-${colorMode}-link` : `${colorMode}-link`);

            nodes.push((
                <Link
                    key={content.file}
                    to={`/${book.id}/${content.file}`}
                    replace={isNotPurchasedBook}
                    style={{
                        marginTop: '6px',
                        marginBottom: '6px',
                        marginLeft: content.type === 'section' ? '2rem' : '1rem',
                        fontSize: '14px',
                        cursor: isDisabled ? 'default' : 'pointer'
                    }}
                    className={className}
                    onClick={event => {
                        if (isDisabled || disableLink || isCurrentFile) {
                            event.preventDefault();
                            event.stopPropagation();
                            return;
                        }

                        if (onClose) onClose();
                    }}
                >
                    <Text width="100%" textAlign="left" wordBreak="keep-all">
                        {content.isNumbered && (
                            <strong style={{marginRight: '6px'}}>
                                { content.type === 'section' ? `${chapterIndex}.${sectionIndex}.` : `${chapterIndex}.` }
                            </strong>
                        )}
                        {content.title}
                    </Text>
                </Link>
            ));
        }

        index++;
    }

    return (
        <Stack
            width="100%"
            spacing={0}
            marginBottom="-1px"
        >
            {nodes}
        </Stack>
    );
}
