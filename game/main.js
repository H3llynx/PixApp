import { backgrounds, cats } from "./config.js";
import { createCatImage, createTransition, getEllipse, leafCaught } from "./utils.js";
import { homeSlider } from "./visuals.js";

const header = document.querySelector("header");
const slider = document.querySelector(".cat-container");
const main = document.querySelector("main");
const leafContainer = document.getElementById("leaf-zone");
const yucaLeafImg = document.getElementById("leaf-img");
const monsteraLeafImg = document.getElementById("leaf-img2");
const catJumpingZone = document.getElementById("jump-zone");
const catShadow = document.querySelector(".cat-shadow");
const leafShadow = document.querySelector(".leaf-shadow");
const selectCatImg = document.querySelectorAll(".select");
const srStatus = document.getElementById("sr-status");
const players = document.querySelectorAll("[data-cat]");

let decorIndex = 0;
document.body.style.backgroundImage = backgrounds[decorIndex]
document.body.style.backgroundPosition = "center bottom 45%";

// --------- SETS VICTORY MESSAGE AND REPlAY OPTION -----------------------------
const gotchaText = Object.assign(document.createElement("p"), {
    className: "p2",
    textContent: "Got it!"
});
const replayButton = Object.assign(document.createElement("button"), {
    textContent: "Yes"
});
const replayButtonNo = Object.assign(document.createElement("button"), {
    textContent: "No"
});
const replayText = Object.assign(document.createElement("p"), {
    className: "p3",
    textContent: "Play again?"
});
const replayDiv = Object.assign(document.createElement("div"), {
    className: "replay-div"
});
replayDiv.append(replayText, replayButton, replayButtonNo);

// --------- CAT SELECTION VISUALS ON MOBILE SLIDER -----------------------------
homeSlider();

// --------- SETS CAT AND INIT GAME ---------------------------------------------
const currentCat = {};
let currentCatName = "";

const selectCat = () => {
    players.forEach((selection) => {
        selection.addEventListener("click", () => {
            const cat = selection.dataset.cat;
            currentCatName = cat;
            const transition = createTransition();
            document.body.appendChild(transition);
            setTimeout(() => {
                transition.style.opacity = 1;
            }, 10);
            setTimeout(() => {
                selectCatImg.forEach(img => {
                    if (img.dataset.cat === cat) {
                        img.classList.add('selected');
                        img.classList.remove('dimmed');
                        img.setAttribute("aria-selected", "true");
                    }
                    else {
                        img.classList.remove('selected');
                        img.classList.add('dimmed');
                        img.setAttribute("aria-selected", "false");
                    }
                    document.querySelector("h1").classList.add('dimmed');
                });
            }, 100);
            setTimeout(() => {
                // Accessibility:
                srStatus.textContent = `You are playing with ${currentCatName}. Click of press Enter to make her jump!`;
                //
                header.style.display = "none";
                main.style.display = "block";
                const gettingReady = createCatImage(cats[cat].prejump.src, cats[cat].prejump.className);
                main.appendChild(gettingReady);
                const jumpingImg = createCatImage(cats[cat].jump.src, cats[cat].jump.className);
                catJumpingZone.appendChild(jumpingImg);
                const catPaw = document.createElement("div");
                catPaw.id = cats[cat].paw.id;
                catJumpingZone.appendChild(catPaw);
                currentCat.gettingReady = gettingReady;
                currentCat.jumpingImg = jumpingImg;
                currentCat.paw = catPaw;
                addJumpingListeners(gettingReady);
                transition.style.opacity = 0;
                setTimeout(() => {
                    transition.remove();
                    document.querySelector("h1").classList.remove('dimmed');
                    selectCatImg.forEach(img => {
                        img.classList.remove("selected", "dimmed");
                        img.setAttribute("aria-selected", "false");
                    })
                }, 1000);
            }, 1000);
        })
    })
};
const randomLazyCat = () => {
    // Accessibility:
    srStatus.textContent = `${currentCatName} feels to tired to jump. She is now lazily rolling on the floor. Try again!`;
    //
    removeJumpingListeners(currentCat.gettingReady);
    const lazyCat = createCatImage(cats[currentCatName].lazy.src, cats[currentCatName].lazy.className); // forces the browser to reload the GIF animation each time
    const text = document.createElement("p");
    text.textContent = "Nap time!";
    text.classList.add("p1");
    main.appendChild(lazyCat);
    main.appendChild(text);
    setTimeout(() => {
        text.remove();
        lazyCat.remove();
        currentCat.gettingReady.classList.remove("hidden");
        addJumpingListeners(currentCat.gettingReady);
    }, 1300);
}
const victory = (startIndex) => {
    removeJumpingListeners(currentCat.gettingReady);
    // Accessibility:
    srStatus.textContent = `Yeah! ${currentCatName} caught the leaf!`;
    //
    const randomIndex = `${Math.floor(Math.random() * 2) + startIndex}`;
    const landing = cats[currentCatName].landing[randomIndex];
    const catDown = createCatImage(landing.src, landing.className);
    currentCat.catDown = catDown;
    setTimeout(() => {
        currentCat.jumpingImg.classList.add("hidden");
        leafContainer.style.display = "none";
        catJumpingZone.style.bottom = "0";
        leafShadow.classList.add("hidden");;
        catShadow.classList.remove("jump");
        catJumpingZone.appendChild(catDown)
        main.appendChild(gotchaText);
    }, 100);
    setTimeout(() => {
        gotchaText.remove();
    }, 1200);
    setTimeout(() => {
        main.appendChild(replayDiv);
        srStatus.textContent = '';
        setTimeout(() => {
            srStatus.textContent = "Click or press Tab to indicate if you want to replay or not.";
        }, 50);
        replayButtonNo.setAttribute("tabindex", "0");
        replayButton.setAttribute("tabindex", "0");
        replayButton.focus();
    }, 1600);
}
// --------- MAKES CAT JUMP / STOP JUMPING -------------------------------------
const jumping = () => {
    currentCat.gettingReady.classList.add("hidden");
    // Randomly triggers lazy cat animation:
    let randomArr = [1, 2, 3, 4, 5, 6];
    let randomIndex = Math.floor(Math.random() * randomArr.length);
    let random = randomArr[randomIndex];
    if (random === 2) {
        randomLazyCat();
    }
    else {
        // Accessibility:
        srStatus.textContent = `${currentCatName} is jumping`;
        // Retrieves leaves and paw area:
        catJumpingZone.style.bottom = `${Math.floor(Math.random() * 19) + 3}%`;
        catJumpingZone.style.display = "block";
        catShadow.classList.add("jump");
        const pawReach = currentCat.paw.getBoundingClientRect();
        const yucaLeafArea = yucaLeafImg.getBoundingClientRect();
        const monsteraLeafArea = monsteraLeafImg.getBoundingClientRect();
        const pawEllipse = getEllipse(pawReach);
        const yucaLeafEllipse = getEllipse(yucaLeafArea);
        const monsteraLeafEllipse = getEllipse(monsteraLeafArea);
        // When playing with Yuca leaf:
        if (leafCaught(pawEllipse, yucaLeafEllipse)) {
            victory(0)
        }
        // When playing with Monstera leaf:
        else if (leafCaught(pawEllipse, monsteraLeafEllipse)) {
            victory(2)
        }
    }
};
const stopJumping = () => {
    catJumpingZone.style.display = "none";
    currentCat.gettingReady.classList.remove("hidden");
    catShadow.classList.remove("jump");
};
const replay = () => {
    // Accessibility:
    srStatus.textContent = `${currentCatName} is ready to play again! Click of press Enter to make her jump!`;
    //
    const transition = createTransition();
    document.body.appendChild(transition);
    setTimeout(() => {
        transition.style.opacity = 1;
    }, 10);
    setTimeout(() => {
        replayDiv.remove();
        if (currentCat.catDown) {
            currentCat.catDown.remove();
            currentCat.catDown = null;
        }
        currentCat.jumpingImg.classList.remove("hidden");
        leafShadow.classList.remove("hidden");
        catJumpingZone.style.display = "none";
        currentCat.gettingReady.classList.remove("hidden");
        leafContainer.style.display = "block";
        decorIndex += 1;
        if (decorIndex >= backgrounds.length) {
            decorIndex = 0;
        }
        document.body.style.backgroundImage = backgrounds[decorIndex];
        if (backgrounds[decorIndex] === "url(pix/background4.png)") {
            document.body.style.backgroundPosition = "center bottom 10%";
        } else {
            document.body.style.backgroundPosition = "center bottom 45%";
        }
        if (decorIndex % 2 == 0) {
            yucaLeafImg.classList.add("hidden");
            monsteraLeafImg.classList.remove("hidden");
        }
        else {
            yucaLeafImg.classList.remove("hidden");
            monsteraLeafImg.classList.add("hidden");
        }
        transition.style.opacity = 0;
        setTimeout(() => {
            transition.remove();
        }, 1000);
    }, 1000);
    addJumpingListeners(currentCat.gettingReady);
}
const replayNo = () => {
    // Accessibility:
    srStatus.textContent = `Thank you for playing with ${currentCatName}! \
    We hope to see you again soon. You will now be redirected to the cat selection page.`;
    //
    const transition = createTransition();
    document.body.appendChild(transition);
    setTimeout(() => {
        transition.style.opacity = 1;
    }, 10);
    setTimeout(() => {
        replayDiv.remove();
        if (currentCat.catDown) {
            currentCat.catDown.remove();
            currentCat.catDown = null;
        }
        removeJumpingListeners(currentCat.gettingReady);
        currentCat.gettingReady.remove();
        currentCat.jumpingImg.remove();
        currentCat.paw.remove();
        main.style.display = "none";
        decorIndex = 0;
        document.body.style.backgroundImage = backgrounds[decorIndex];
        catJumpingZone.style.display = "none";
        leafShadow.classList.remove("hidden");
        leafContainer.style.display = "block";
        yucaLeafImg.classList.remove("hidden");
        monsteraLeafImg.classList.add("hidden");
        transition.style.opacity = 0;
        setTimeout(() => {
            transition.remove();
        }, 1000);
        header.style.display = "flex";
    }, 1000);
}
// --------- EVENT LISTENERS ----------------------------------------------------
const keyboardCatSelection = () => {
    slider.querySelectorAll('[role="button"]').forEach(cat => {
        cat.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cat.click();
            }
        });
    });
}
function handleTouchStart(e) {
    jumping();
}
function handleTouchEnd(e) {
    stopJumping();
}
function handleTouchCancel(e) {
    stopJumping();
}
function handleKeydown(e) {
    if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
        jumping();
    }
}
function handleKeyUp(e) {
    if (e.key === "Enter" || e.key === " ") {
        stopJumping();
    }
}
function addJumpingListeners(e) {
    e.addEventListener("mousedown", jumping);
    e.addEventListener("mouseup", stopJumping);
    e.addEventListener("mouseleave", stopJumping);
    e.addEventListener("touchstart", handleTouchStart, { passive: false });
    e.addEventListener("touchend", handleTouchEnd, { passive: false });
    e.addEventListener("touchcancel", handleTouchCancel, { passive: false });
    // Keyboard accessibility support:
    e.setAttribute("tabindex", "0");
    e.setAttribute("role", "button");
    e.setAttribute("aria-label", "Click or press Enter to make the cat jump!");
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyUp);
};
function removeJumpingListeners(e) {
    e.removeEventListener("mousedown", jumping);
    e.removeEventListener("mouseup", stopJumping);
    e.removeEventListener("mouseleave", stopJumping);
    e.removeEventListener("touchstart", handleTouchStart);
    e.removeEventListener("touchend", handleTouchEnd);
    e.removeEventListener("touchcancel", handleTouchCancel);
    // Keyboard accessibility support:
    e.removeAttribute("tabindex");
    e.removeAttribute("role");
    e.removeAttribute("aria-label");
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("keyup", handleKeyUp);
}
replayButton.addEventListener("click", replay);
replayButtonNo.addEventListener("click", replayNo);

export default () => {
    selectCat();
    keyboardCatSelection();
}
