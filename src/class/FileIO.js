import { solids } from "@randajan/props";
import { loadFiles, saveFile } from "../static";

/**
 * @typedef {Object} FileIOOptions
 * @property {string} [mimeType="text/plain"] MIME type used for saved files and picker filter.
 * @property {string} [charset="utf-8"] Charset used for text encoding/decoding.
 * @property {string} [extension="txt"] Default file extension (with or without leading dot).
 * @property {string} [defaultFileName="file"] Fallback file name used by {@link FileIO#save}.
 * @property {(data:any)=>string} [serialize] Data serializer used before saving.
 * @property {(text:string)=>any} [deserialize] Text deserializer used after loading.
 */

/**
 * Lightweight browser file I/O wrapper.
 * Uses customizable `serialize`/`deserialize` handlers over text-based files.
 */
export class FileIO {

    /**
     * @param {FileIOOptions} [options]
     */
    constructor({
        mimeType = "text/plain",
        charset = "utf-8",
        extension = "txt",
        defaultFileName = "file",
        serialize = (data) => String(data),
        deserialize = (text) => text,
    } = {}) {

        solids(this, {
            mimeType,
            charset,
            extension,
            defaultFileName,
            serialize,
            deserialize
        });

    }

    /**
     * Save one file to user disk.
     *
     * @param {any} data Data to serialize and save.
     * @param {string} [fileName] Optional file name without/with extension.
     * @returns {void}
     */
    save(data, fileName) { return saveFile(this, data, fileName); }

    /**
     * Open file picker and load one file.
     *
     * @returns {Promise<any>} Deserialized value from selected file.
     */
    async load() { return loadFiles(this, false); }

    /**
     * Open file picker and load multiple files of the same configured type.
     *
     * @returns {Promise<any[]>} Array of deserialized values in picker selection order.
     */
    async loadMany() { return loadFiles(this, true); }


}
