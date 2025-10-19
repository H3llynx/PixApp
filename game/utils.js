// --------- TRANSITION HELPER -------------------------------------------------
export const createTransition = () => {
    const transition = document.createElement("div");
    transition.style.width = "100vw";
    transition.style.height = "100vh";
    transition.style.opacity = "0";
    transition.style.position = "fixed";
    transition.style.top = "0";
    transition.style.left = "0";
    transition.style.background = "#000";
    transition.style.transition = "opacity 1.3s ease-in-out";
    transition.style.zIndex = "2";
    return transition;
}
// --------- HELPER TO CREATE CAT IMAGES ---------------------------------------
export function createCatImage(src, className) {
    const img = document.createElement("img");
    img.src = src;
    img.className = className;
    return img;
}
// --------- HELPER TO RETRIEVE PAW / LEAF AREAS -------------------------------
export const getEllipse = (rect) => {
    const offset = 5;
    return {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        rx: (rect.width / 2) - offset,
        ry: (rect.height / 2) - offset
    };
}
// --------- HELPER TO DETECT COLLISION BETWEEN PAW & LEAF AREAS ---------------
export const leafCaught = (e1, e2) => {
    // Calculate distance between centers
    const dx = e1.cx - e2.cx;
    const dy = e1.cy - e2.cy;
    // Averages both radii:
    const r1 = (e1.rx + e1.ry) / 2;
    const r2 = (e2.rx + e2.ry) / 2;
    // Formula to detect overlapping (returns true or false):
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2);
}