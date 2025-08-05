import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { VOID_NULL } from 'src/types/void_null';

const useMessageToastify = () => {
    return useCallback((text: string | VOID_NULL, type: string | VOID_NULL) => {
        if (text) {
            if (type === "info") {
                toast.info(text);
            } else if (type === "success") {
                toast.success(text);
            } else if (type === "warning") {
                toast.warn(text);
            } else if (type === "error") {
                toast.error(text);
            } else if (type === "dark") {
                toast.dark(text);
            } else {
                toast(text);
            }
        }
    }, []);
}

export default useMessageToastify;