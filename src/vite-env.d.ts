/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_TOSSPAYMENTS_CLIENT_KEY: string;
    VITE_GITHUB_OAUTH_CLIENT_ID: string;
    VITE_DISCORD_OAUTH_CLIENT_ID: string;
    VITE_DISCORD_SERVER_URL: string;
    VITE_DISABLE_BUSINESS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
