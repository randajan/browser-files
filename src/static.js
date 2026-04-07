import {
    createHiddenInput,
    createObjectUrl,
    createTextBlob,
    downloadObjectUrl,
    loadTexts,
    normalizeFileName,
    revokeObjectUrl,
} from "./tools";

/**
 * Load one or more files and deserialize text payload.
 *
 * @param {{extension:string, mimeType:string, charset:string, deserialize:(text:string)=>any}} _io
 * @param {boolean} [multiple=false]
 * @returns {Promise<any | any[]>}
 */
export const loadFiles = async (_io, multiple = false) => {
    const { extension, mimeType, charset, deserialize } = _io;

    const input = createHiddenInput(extension, mimeType, multiple);
    const texts = await loadTexts(input, charset);

    try {
        if (!multiple) { return deserialize(texts[0]); }
        return texts.map((text) => deserialize(text));
    } catch (cause) {
        throw new Error("Read failed", { cause });
    }
};

/**
 * Serialize and save a single file.
 *
 * @param {{serialize:(data:any)=>string, mimeType:string, charset:string, extension:string, defaultFileName:string}} _io
 * @param {any} data
 * @param {string} [fileName]
 * @returns {void}
 */
export const saveFile = (_io, data, fileName) => {
    const { serialize, mimeType, charset, extension, defaultFileName } = _io;
    const normalizedFileName = normalizeFileName(fileName, extension, defaultFileName);

    const content = serialize(data);
    const blob = createTextBlob(content, mimeType, charset);
    const url = createObjectUrl(blob);

    try {
        downloadObjectUrl(url, normalizedFileName);
    } finally {
        revokeObjectUrl(url);
    }
};
