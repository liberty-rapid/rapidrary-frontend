import { useRef } from "react";
import {
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    IconButton,
    useOutsideClick,
    useColorMode
} from "@chakra-ui/react";
import { RiUser3Fill } from "react-icons/ri";

import AccountPanel from "./AccountPanel";

type AccountPopoverProps = {
    triggerIconColor?: string;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export default function AccountPopoveer({ triggerIconColor, isOpen, onOpen, onClose }: AccountPopoverProps) {
    const popoverContentRef = useRef(null);

    const { colorMode } = useColorMode();

    useOutsideClick({
        ref: popoverContentRef,
        handler: onClose
    });

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            closeOnBlur={true}
            placement="bottom-end"
        >
            <PopoverTrigger>
                <IconButton
                    mr="16px"
                    variant="ghost"
                    icon={<RiUser3Fill color={triggerIconColor} size="20px" />}
                    aria-label="계정 패널"
                />
            </PopoverTrigger>
            <PopoverContent
                ref={popoverContentRef}
                bg={colorMode === 'light' ? '#fafafa' : '#171923cc'}
                backdropFilter={{ base: "blur(5px)", md: "blur(12px)" }}
            >
                <PopoverHeader>
                    계정
                    <PopoverCloseButton />
                </PopoverHeader>
                <PopoverBody
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    px={2}
                >
                    <AccountPanel onClose={onClose} />                
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
