import { Book, Content } from "../api/apiTypes";

export function getNextContent(book: Book, currentFile?: string, previewOnly?: boolean): Content | null {
    let available = currentFile ? false : true;

    for (const content of book.index) {
        if (typeof content === 'string') {
            continue;
        }

        if (currentFile === content.file) {
            available = true;
        } else if (available && (!previewOnly || content.isPreview)) {
            return content;
        }

        if (content.sections) {
            for (const section of content.sections) {
                if (currentFile === section.file) {
                    available = true;
                } else if (available && (!previewOnly || section.isPreview)) {
                    return section;
                }
            }
        }
    }

    return null;
}

export function getPrevContent(book: Book, currentFile?: string, previewOnly?: boolean): Content | null {
    let available = currentFile ? false : true;

    for (const content of [...book.index].reverse()) {
        if (typeof content === 'string') {
            continue;
        }

        if (content.sections) {
            for (const section of [...content.sections].reverse()) {
                if (currentFile === section.file) {
                    available = true;
                } else if (available && (!previewOnly || content.isPreview)) {
                    return section;
                }
            }
        }

        if (currentFile === content.file) {
            available = true;
        } else if (available && (!previewOnly || content.isPreview)) {
            return content;
        }
    }

    return null;
}

export function getContentByFile(book: Book, file: string): Content | null {
    for (const content of book.index) {
        if (typeof content === 'string') {
            continue;
        }

        if (content.file === file) {
            return content;
        }

        if (content.sections) {
            for (const section of content.sections) {
                if (section.file === file) {
                    return section;
                }
            }
        }
    }

    return null;
}

export default { getNextContent, getPrevContent, getContentByFile };
