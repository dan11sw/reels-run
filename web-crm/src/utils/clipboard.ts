
/**
 * Проверка доступа к буферу обмена
 * @returns 
 */
export async function checkClipboardReadSupport(cb?: (res: string) => void) {
    if (!navigator?.clipboard || !navigator.clipboard?.readText) {
        console.error("Чтение из буфера не поддерживается");
        cb && cb("");

        return -1;
    }

    try {
        // Пробуем прочитать текст (может запросить разрешение)
        const text = await navigator.clipboard.readText();
        cb && cb(text);

        return 1;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error(err);
        }

        cb && cb("");
        return 0;
    }
}