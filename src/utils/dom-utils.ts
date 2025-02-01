export const transformUrls = (html: string, transform: (url: string, tag: string) => string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const urlAttributes = {
        'a': ['href', 'ping'],
        'area': ['href'],
        'audio': ['src'],
        'base': ['href'],
        'blockquote': ['cite'],
        'button': ['formaction'],
        'embed': ['src'],
        'form': ['action'],
        'frame': ['src', 'longdesc'],
        'head': ['profile'],
        'html': ['manifest'],
        'iframe': ['src', 'longdesc'],
        'img': ['src', 'srcset', 'longdesc', 'usemap'],
        'input': ['src', 'usemap', 'formaction'],
        'ins': ['cite'],
        'link': ['href'],
        'object': ['data', 'usemap'],
        'q': ['cite'],
        'script': ['src'],
        'source': ['src', 'srcset'],
        'track': ['src'],
        'video': ['src', 'poster']
    };

    Object.entries(urlAttributes).forEach(([tag, attrs]) => {
        doc.querySelectorAll(tag).forEach(el => {
            attrs.forEach(attr => {
                const value = el.getAttribute(attr);
                if (value) {
                    if (attr === 'srcset') {
                        el.setAttribute(attr, value.split(',').map(src => {
                            const [url, descriptor] = src.trim().split(/\s+/);
                            return `${transform(url, tag)}${descriptor ? ' ' + descriptor : ''}`;
                        }).join(', '));
                    } else {
                        el.setAttribute(attr, transform(value, tag));
                    }
                }
            });
        });
    });

    return doc.body.innerHTML;
};
