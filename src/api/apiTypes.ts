export interface EmailVerification {
    verificationId: string;
    expiresAt: string;
}

export interface EmailAuthentication {
    verificationId: string;
    email: string;
    code: string;
}

export interface OAuthAuthorization {
    provider: 'github' | 'discord';
    authorizationCode: string;
    redirectUrl?: string;
}

export interface User {
    id: string;
    createdAt: string;
    email: string;
    displayName: string;
    books: string[];
    oauthAccounts: { provider: string }[]
}

export interface Content {
    title: string;
    file: string;
    isPreview?: boolean;
    isNumbered?: boolean;
}

export interface Chapter extends Content {
    sections?: Content[]
}

export interface Book {
    id: string;    
    title: string;
    description: string;
    tags: string[];
    language: string;
    coverImage?: string;
    price: number;
    currency: string;
    index: (string | Chapter)[];
    hidden?: boolean;
    pinned?: boolean;
}

export interface CreateOrderRequest {
    orderId: string;
    bookId: string;
    amount: number;
}

export interface ConfirmPaymentRequest {
    paymentKey: string;
    orderId: string;
    amount: number;
}

export interface Payment {
    orderId: string;
    approvedAt: string;
    orderName: string;
    method: string;
    currency: string;
    totalAmount: number;
    status: string;
}
