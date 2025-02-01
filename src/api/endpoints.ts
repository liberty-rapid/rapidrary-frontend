import apiClient from "./apiClient";
import { Book, ConfirmPaymentRequest, CreateOrderRequest, EmailVerification, EmailAuthentication, Payment, User, OAuthAuthorization } from "./apiTypes";

export const fetchMe = async () => {
    const response = await apiClient.get('/users/me');
    return response.data as (User | null);
};

export const fetchBooks = async () => {
    const response = await apiClient.get('/books');
    return response.data as Book[];
};

export const fetchBook = async (bookId: string) => {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data as Book;
};

export const fetchBookFile = async (bookId: string, file: string) => {
    const response = await apiClient.get(`/books/${bookId}/${file}`);
    return response.data;
};

export const checkEmail = async (email: string) => {
    const response = await apiClient.post('/check-email', { email });
    return response.data as boolean;
};

export const requestEmailVerification = async (email: string) => {
    const response = await apiClient.post('/email-verifications', { email });
    return response.data as EmailVerification;
};

export const signInByEmail = async (emailAuthentication: EmailAuthentication) => {
    const response = await apiClient.post('/sign-in-by-email', emailAuthentication);
    return response.data as User;
};

export const signInByOAuth = async (oauthAuthorization: OAuthAuthorization) => {
    const response = await apiClient.post('/sign-in-by-oauth', oauthAuthorization);
    return response.data as User;
};

export const updateMyEmail = async (emailAuthentication: EmailAuthentication) => {
    await apiClient.put('/users/me/email', emailAuthentication);
};

export const updateMyDisplayName = async (displayName: string) => {
    await apiClient.put('/users/me/display-name', { displayName });
};

export const deleteMyAccount = async () => {
    await apiClient.delete(`/users/me`);
};

export const signOut = async () => {
    await apiClient.post(`/sign-out`);
};

export const signOutAll = async () => {
    await apiClient.post(`/sign-out-all`);
};

export const fetchMyPayments = async () => {
    const response = await apiClient.get('/users/me/payments');
    return response.data as Payment[];
};

export const createOrder = async (createOrderRequest: CreateOrderRequest) => {
    await apiClient.post('/orders', createOrderRequest);
};

export const confirmPayment = async (confirmPaymentRequest: ConfirmPaymentRequest) => {
    await apiClient.post('/confirm-payment', confirmPaymentRequest);
};
