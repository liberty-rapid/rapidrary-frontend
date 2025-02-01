import { BsFillGridFill } from "react-icons/bs";
import { HiMiniCpuChip } from "react-icons/hi2";
import { IoCodeSlash } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { TbMathFunction } from "react-icons/tb";

export const TOSSPAYMENTS_CLIENT_KEY = import.meta.env.VITE_TOSSPAYMENTS_CLIENT_KEY;
export const GITHUB_OAUTH_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;
export const DISCORD_OAUTH_CLIENT_ID = import.meta.env.VITE_DISCORD_OAUTH_CLIENT_ID;

export const BOOK_TAG_CHOICES = [
    { translationKey: 'category_all', name: '', icon: BsFillGridFill },
    { translationKey: 'category_coding', name: 'Coding', icon: IoCodeSlash },
    { translationKey: 'category_computer_science', name: 'Computer Science', icon: RiComputerLine },   
    { translationKey: 'category_mathematics', name: 'Math', icon: TbMathFunction },
    { translationKey: 'category_artificial_intelligence', name: 'AI', icon: HiMiniCpuChip }
];

export const TERMS = [
    { id: 1, title: "서비스 이용약관 (필수)", url: "/api/v1/books/info/terms_of_use.html" },
    { id: 2, title: "개인정보 처리방침 (필수)", url: "/api/v1/books/info/privacy_policy.html" }
];

export const DISCORD_SERVER_URL = import.meta.env.VITE_DISCORD_SERVER_URL;
