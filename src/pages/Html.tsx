import { Center, Box, useColorModeValue } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import { useHtml } from '../hooks/query/useHtml';
import ContentRenderer from '../components/viewer/ContentRenderer';
import Loading from '../components/Loading';

type Props = {
    url: string
};

export default function Html({ url }: Props) {
    const { data: content } = useHtml(url);

    const color = useColorModeValue('rgba(0, 0, 0, 0.9)', 'rgba(255, 255, 255, 0.75)');

    if (!content) {
        return <Box mt="20vh"><Loading message="불러오는 중" /></Box>;
    }

    return (
        <Center>
            <Helmet><title>Rapidrary</title></Helmet>
            <Box width="800px" p="15px 15px 100px 15px" color={color}>
                <ContentRenderer
                    content={content}
                />                
            </Box>
        </Center>
    );
}
