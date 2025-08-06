import { isUndefinedOrNull } from "src/types/void_null";

export function isHttpStatusValid(status?: number): boolean {
    if(isUndefinedOrNull(status)) {
        return false;
    }

    return (status === 200) || (status === 201);
}