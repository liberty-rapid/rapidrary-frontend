import { Heading, HeadingProps, HStack } from "@chakra-ui/react";
import { Link as ChakraLink } from '@chakra-ui/react';

interface HashedHeadingProps extends HeadingProps {
    id: string;
}

export default function HashedHeading({ id, ...props }: HashedHeadingProps) {
    return (
        <HStack
            id={id}         
            spacing={2}
        >
            <Heading {...props}>
                <ChakraLink
                    id={id}
                    textDecoration="none"
                    href={`#${id}`}
                >
                    {props.children}
                </ChakraLink>
            </Heading>
        </HStack>
    );
}
