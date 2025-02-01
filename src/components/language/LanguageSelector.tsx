import { IconButton, IconButtonProps, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoCheckmark, IoLanguage } from "react-icons/io5";

export default function LanguageSelector(props: IconButtonProps) {
    const { i18n } = useTranslation();

    const languageNames = {
        en: "English",
        ko: "한국어",
        ja: "日本語"
    };

    return (
        <Menu>
            <MenuButton as={IconButton} {...props}>
                <IoLanguage />
            </MenuButton>
            <MenuList>
                {i18n.options.supportedLngs && i18n.options.supportedLngs.map(language => (
                    <MenuItem
                        key={language}
                        onClick={() => i18n.changeLanguage(language)}
                    >
                        {i18n.language == language && <IoCheckmark style={{marginRight: "5px"}} />}
                        {languageNames[language as keyof typeof languageNames]}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
