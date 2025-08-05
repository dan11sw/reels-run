export const distancePoint = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1 - x2), 2)
        + Math.pow((y1 - y2), 2));
}

export const intersectionCircles = (x1, y1, x2, y2, r1, r2) => {
    return (distancePoint(x1, y1, x2, y2) < (r1 + r2));
}

export const pointInCircles = (x, y, x0, y0, r) => {
    return ((Math.pow((x - x0), 2) + Math.pow((y - y0), 2)) <= Math.pow(r, 2));
}

export const radiusLatLng = (radius) => {
    return (radius / 100000);
}

const mathCircle = {
    distancePoint,
    intersectionCircles,
    pointInCircles,
    radiusLatLng
};

export default mathCircle;