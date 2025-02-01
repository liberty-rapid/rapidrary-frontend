import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, useBreakpointValue } from '@chakra-ui/react';

import { useHtml } from '../../hooks/query/useHtml';

import ContentRenderer from '../viewer/ContentRenderer';
import Loading from '../Loading';

type TermModalProps = {
    term: { title: string, url: string };
    isOpen: boolean;
    onClose: () => void;
};

export default function TermModal({ term, isOpen, onClose }: TermModalProps) {
    const modalSize = useBreakpointValue({ base: 'full', 'xl': '5xl' }, { ssr: false });

    const { data: content } = useHtml(term.url);

    if (!content) {
        return <Box mt="10vh"><Loading message="불러오는 중..." /></Box>;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={modalSize}
            blockScrollOnMount={false}
            scrollBehavior="inside"
        >
            <ModalContent height="60rem">
                <ModalCloseButton />
                <ModalHeader>{term.title}</ModalHeader>
                <ModalBody>
                    <ContentRenderer
                        content={content}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>    
    );
}
