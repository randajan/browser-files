/**
 * Normalize extension by trimming and removing optional leading dot.
 *
 * @param {string} [extension=""]
 * @returns {string}
 */
export const normalizeExtension = (extension = "") => {
    const normalized = String(extension ?? "").trim();
    if (!normalized) { return ""; }
    return normalized.startsWith(".") ? normalized.slice(1) : normalized;
};

/**
 * Build final file name and ensure configured extension is present.
 *
 * @param {string | null | undefined} fileName
 * @param {string | null | undefined} extension
 * @param {string} [fallback="file"]
 * @returns {string}
 */
export const normalizeFileName = (fileName, extension, fallback = "file") => {
    const normalizedExt = normalizeExtension(extension);
    const normalizedFallback = String(fallback ?? "").trim() || "file";
    let normalizedName = String(fileName ?? "").trim() || normalizedFallback;

    if (!normalizedExt) { return normalizedName; }

    const ext = `.${normalizedExt}`;
    if (!normalizedName.toLowerCase().endsWith(ext.toLowerCase())) {
        normalizedName += ext;
    }

    return normalizedName;
};

/**
 * Create text blob from serialized content.
 *
 * @param {string} content
 * @param {string} [mimeType="text/plain"]
 * @param {string} [charset="utf-8"]
 * @returns {Blob}
 */
export const createTextBlob = (content, mimeType = "text/plain", charset = "utf-8") => {
    return new Blob([content], { type:`${mimeType};charset=${charset}` });
};

/**
 * Create object URL for blob.
 *
 * @param {Blob} blob
 * @returns {string}
 */
export const createObjectUrl = (blob) => {
    return URL.createObjectURL(blob);
};

/**
 * Revoke object URL.
 *
 * @param {string} url
 * @returns {void}
 */
export const revokeObjectUrl = (url) => {
    URL.revokeObjectURL(url);
};

const cleanupNode = (node) => {
    if (node?.parentNode) {
        node.parentNode.removeChild(node);
    }
};

/**
 * Trigger download for object URL.
 *
 * @param {string} url
 * @param {string} fileName
 * @returns {void}
 */
export const downloadObjectUrl = (url, fileName) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    cleanupNode(a);
};

const buildAccept = (extension, mimeType) => {
    const accept = [];
    const normalizedExt = normalizeExtension(extension);
    const normalizedMimeType = String(mimeType ?? "").trim();

    if (normalizedExt) { accept.push(`.${normalizedExt}`); }
    if (normalizedMimeType) { accept.push(normalizedMimeType); }

    return accept.join(",");
};

/**
 * Create hidden file input configured for desired type and mode.
 *
 * @param {string | null | undefined} extension
 * @param {string | null | undefined} mimeType
 * @param {boolean} [multiple=false]
 * @returns {HTMLInputElement}
 */
export const createHiddenInput = (extension, mimeType, multiple = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = buildAccept(extension, mimeType);
    input.multiple = !!multiple;
    input.style.display = "none";
    document.body.appendChild(input);
    return input;
};

const pickFiles = (input, cancelCheckDelay = 300) => {
    return new Promise((resolve, reject) => {
        let isDone = false;

        const finish = (fn, value) => {
            if (isDone) { return; }
            isDone = true;
            cleanup();
            fn(value);
        };

        const resolveSelection = () => {
            const files = Array.from(input.files || []);
            if (!files.length) {
                finish(reject, new Error("No file selected"));
                return;
            }
            finish(resolve, files);
        };

        const onChange = () => {
            resolveSelection();
        };

        const onWindowFocus = () => {
            window.setTimeout(() => {
                if (isDone) { return; }
                resolveSelection();
            }, cancelCheckDelay);
        };

        const cleanup = () => {
            input.removeEventListener("change", onChange);
            window.removeEventListener("focus", onWindowFocus, true);
        };

        input.addEventListener("change", onChange, { once: true });
        window.addEventListener("focus", onWindowFocus, true);
        input.click();
    });
};

const readFileAsText = (file, charset = "utf-8") => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (cause) => {
            reject(new Error("Load failed", {cause}));
        };

        reader.readAsText(file, charset);
    });
};

/**
 * Open picker for already-created hidden input and read selected files as text.
 *
 * @param {HTMLInputElement} input
 * @param {string} [charset="utf-8"]
 * @param {number} [cancelCheckDelay=300]
 * @returns {Promise<string[]>}
 */
export const loadTexts = async (input, charset = "utf-8", cancelCheckDelay = 300) => {
    try {
        const files = await pickFiles(input, cancelCheckDelay);
        return await Promise.all(files.map((file) => readFileAsText(file, charset)));
    } finally {
        cleanupNode(input);
    }
};
