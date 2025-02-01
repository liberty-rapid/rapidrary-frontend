import { Stack, HStack, IconButton, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { BOOK_TAG_CHOICES } from "../../constants";

type BookTagSelectorProps = {
    tag: string;
    setTag: (tag: string) => void;
};

export default function BookTagSelector({ tag, setTag }: BookTagSelectorProps) {
    const { t } = useTranslation('common');

    return (
        <HStack spacing={0}>
            {BOOK_TAG_CHOICES.map(choice => {
                const Icon = choice.icon;
                const isSelected = choice.name === tag;

                return (
                    <Stack key={choice.name} width="68px" spacing="4px" align="center">
                        <IconButton
                            borderRadius="12px"
                            variant={isSelected ? 'solid' : 'outline'}
                            colorScheme={isSelected ? 'blue' : 'gray'}
                            size="lg"
                            icon={<Icon size="32px" />}
                            aria-label={choice.name === '' ? '전체' : choice.name}
                            onClick={() => setTag(choice.name)}
                        />
                        <Text
                            fontWeight={isSelected ? 'bold' : 'regular'}
                            fontSize={{ base: '11px', md: '12px' }}
                        >
                            {t(choice.translationKey)}
                        </Text> 
                    </Stack>
                );
            })}
        </HStack>
    );
}
