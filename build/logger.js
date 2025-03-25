"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const LOG_FILE = (0, path_1.join)(__dirname, "mcp-server.log");
function formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data
        ? `\n${JSON.stringify(data, null, 2)}`
        : "";
    return `[${timestamp}] [${level}] ${message}${dataStr}\n`;
}
exports.logger = {
    info(message, data) {
        const logMessage = formatMessage("INFO", message, data);
        (0, fs_1.appendFileSync)(LOG_FILE, logMessage);
    },
    error(message, error) {
        const logMessage = formatMessage("ERROR", message, error);
        (0, fs_1.appendFileSync)(LOG_FILE, logMessage);
    },
};
//# sourceMappingURL=logger.js.map