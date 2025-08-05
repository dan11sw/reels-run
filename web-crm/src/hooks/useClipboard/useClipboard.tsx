import { useEffect, useRef, useState } from "react";
import { isUndefinedOrNull } from "src/types/void_null";
import { checkClipboardReadSupport } from "src/utils/clipboard";

export type ClipboardAccessState = {
    canRead: boolean;
    isSupported: boolean;
    isDocumentFocused: boolean;
}

/**
 * Хук для определения клика вне области определённого компонента
 * @param props Параметры хука
 * @returns 
 */
const useClipboard = () => {
    const [status, setStatus] = useState<ClipboardAccessState>({
        canRead: false,
        isSupported: false,
        isDocumentFocused: document.hasFocus()
    });

    const handleCheckClipboard = () => {
        checkClipboardReadSupport()
            .then((value) => {
                const canRead = (value === 1);
                const isSupported = (value >= 0);

                setStatus({
                    canRead: canRead,
                    isSupported: isSupported,
                    isDocumentFocused: document.hasFocus()
                });
            })
            .catch(() => {
                setStatus({
                    canRead: false,
                    isSupported: false,
                    isDocumentFocused: document.hasFocus()
                });
            });
    };

    useEffect(() => {
        handleCheckClipboard();

        window.addEventListener("focus", handleCheckClipboard);
        window.addEventListener("blur", handleCheckClipboard);

        return () => {
            window.removeEventListener("focus", handleCheckClipboard);
            window.removeEventListener("blur", handleCheckClipboard);
        };
    }, []);

    return [status];
};

export default useClipboard;