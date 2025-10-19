// --------- ARROWS DESIGN IN SLIDER -------------------------------------------
const selectCatImg = document.querySelectorAll(".select");
const slider = document.querySelector(".cat-container");
export const homeSlider = () => {
    const totalCats = selectCatImg.length;
    const getCurrentIndex = () => {
        const scrollLeft = slider.scrollLeft;
        const slideWidth = slider.offsetWidth;
        return Math.round(scrollLeft / slideWidth);
    }
    const updateArrows = (slider, currentIndex) => {
        if (currentIndex === 0) {
            slider.classList.add("hide-left-arrow");
        } else {
            slider.classList.remove("hide-left-arrow");
        }
        if (currentIndex === totalCats - 1) {
            slider.classList.add("hide-right-arrow");
        } else {
            slider.classList.remove("hide-right-arrow");
        }
    }
    slider.addEventListener('scroll', () => {
        const currentIndex = getCurrentIndex();
        updateArrows(slider, currentIndex);
    });
    updateArrows(slider, getCurrentIndex());
}