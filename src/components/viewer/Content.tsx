import path from "path-browserify";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

import { Book } from "../../api/apiTypes";
import { useBookFile } from "../../hooks/query/useBookFile";
import { isAbsoluteUrl, scrollToHash } from "../../utils/common-utils";

import ContentRenderer from "./ContentRenderer";

interface ContentProps {
    book: Book;
    file: string;
};

export default function Content({ book, file }: ContentProps) {
    const location = useLocation();
    const { data: content, isLoading, isSuccess, isError, error } = useBookFile(book.id, file);

    const urlTransform = useCallback((url: string, tag: string) => {
        if (!isAbsoluteUrl(url) && ['img', 'script'].includes(tag)) {
            return path.join(`/api/v1/books/${book.id}/`, url);
        } else {
            return url;
        }
    }, [book.id]);

    useEffect(() => {
        if (isSuccess) {
            if (!location.hash) {
                window.scrollTo({ top: 0 });
            } else {
                scrollToHash(location.hash);
            }            
        }
    }, [isSuccess, location.hash]);

    if (isLoading) {
        return (
            <Stack mt="32px">
                <Skeleton width="70%" height="48px" />
                <Skeleton mt="24px" height="128px" />
                <Skeleton mt="16px" height="128px" />
                <Skeleton mt="16px" height="128px" />
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack mt="20vh" align="center" p={4}>
                <WarningIcon boxSize="32px" />
                <Text mt="20px" fontSize="1rem">
                    콘텐츠를 불러오는 중 오류가 발생했습니다
                </Text>
                <Text
                    mt="6px"
                    fontSize={{ base: '0.75rem', sm: '0.9rem' }}
                >
                    {error.name}: {error.message}
                </Text>
            </Stack>
        );
    }  

    return (
        <ContentRenderer content={content} urlTransform={urlTransform} />
    );
}
