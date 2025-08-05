import fs from 'fs';

/**
 * Удаление файла с жёсткого диска компьютера, на котором запущена служба
 * @param {string} filepath Путь к файлу
 */
export function syncDeleteFileByPath(filepath) {
    if(typeof(filepath) !== "string" || filepath.length === 0) {
        return;
    }
    
    if(fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
}