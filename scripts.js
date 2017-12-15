let currentEntry;
const mapFrame = document.querySelector('.map');
function setActive(entry) {
    if (currentEntry !== entry) {
        if (currentEntry) {
            currentEntry.classList.remove("entry-active");
        }
        currentEntry = entry;
        entry.classList.add("entry-active");
        mapFrame.src = `images/S_und_U-${entry.dataset.name}.png`
    }

}

setActive(document.querySelector(".entry"));

window.addEventListener("scroll", (event) => {
    const topEntry = Array.from(document.querySelectorAll(".entry"))
        .find(node => node.getBoundingClientRect().top > 0);

    if (topEntry) {
        setActive(topEntry);
    }
});
