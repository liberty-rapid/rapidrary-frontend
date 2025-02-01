import { useLocation, useNavigate } from "react-router-dom";
import { Button, Stack } from "@chakra-ui/react";
import { RiAccountCircleFill, RiBook2Fill, RiHistoryFill } from "react-icons/ri";

export default function SettingMenu() {
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        {
            name: '내 서재',
            url: '/my/books',
            icon: <RiBook2Fill size="20px" />,
            ariaLabel: '내 서재'
        },        
        {
            name: '내 계정',
            url: '/my/account',
            icon: <RiAccountCircleFill size="20px" />,
            ariaLabel: '내 계정'
        },
        {
            name: '결제 내역',
            url: '/my/payments',
            icon: <RiHistoryFill size="20px" />,
            ariaLabel: '결제 내역'
        }
    ];

    const onButtonClick = (url: string) => {
        if (location.pathname !== url) {
            navigate(url, { replace: true });
        }
    };

    return (
        <Stack
            width="100%"
            spacing="4px"
        >
            {menu.map(item => (
                <Button
                    key={item.url}
                    justifyContent="start"
                    fontSize='0.9em'
                    variant="ghost"
                    isActive={item.url === location.pathname}
                    leftIcon={item.icon}
                    onClick={() => onButtonClick(item.url)}
                    aria-label={item.ariaLabel}
                >
                    {item.name}
                </Button>
            ))}
        </Stack>
    );
}
