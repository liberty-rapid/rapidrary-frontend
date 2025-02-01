export function generateRandomString(length: number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(length);

    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
    }

    return result;
}

export function isAbsoluteUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function updateHashWithoutAddingHistory(newHash: string) {
    const currentUrl = window.location.href.split('#')[0];
    const newUrl = `${currentUrl}#${newHash}`;

    window.history.replaceState(null, '', newUrl);
}

export function scrollToHash(hash: string) {
    const element = document.querySelector(decodeURI(hash));

    if (element) {
        element.scrollIntoView();
    }
}
