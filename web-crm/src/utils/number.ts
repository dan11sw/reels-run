

export function getNumberFloat(str: string): number | null {
    if(str.trim().length === 0) {
        return null;
    }

    const num = parseFloat(str);
    
    if(!isNaN(num) && isFinite(num)) {
        return num;
    }

    return null;
}