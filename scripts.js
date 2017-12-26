function addElement(tag, className, parent) {
    const element = document.createElement(tag);
    element.className = className;
    parent.appendChild(element);
    return element;
}

class ImageView {
    constructor() {
        this.el = document.querySelector(".map");
        this.fullMap = addElement("img", "map-full", this.el);
        this.zoomMap = addElement("img", "map-zoom", this.el);
        this.zoomMap.style.display = "none";
        this.el.addEventListener("mouseenter", event => this.zoomMap.style.display = "");
        this.el.addEventListener("mousemove", event => this.setZoomPosition(event));
        this.el.addEventListener("mouseleave", event => this.zoomMap.style.display = "none");
    }

    setZoomPosition(event) {
        const n = 10;
        const a = 100;
        const transformOffset = x => {
            let res = a / (a - 2 * n) * x - n;
            res = Math.max(0, res);
            res = Math.min(a, res);
            return res;
        };
        const pos = this.fullMap.getBoundingClientRect();
        const left = transformOffset((event.x - pos.left) / pos.width * 100);
        const top = transformOffset((event.y - pos.top) / pos.height * 100);
        this.zoomMap.style.objectPosition = `${left}% ${top}%`
    }

    setActiveImage(name) {
        const src = `/images/S_und_U-${name}.png`;
        this.fullMap.src = src;
        this.zoomMap.src = src;
    }
}

let currentEntry;
const view = new ImageView()
function setActive(entry) {
    if (currentEntry !== entry) {
        if (currentEntry) {
            currentEntry.classList.remove("entry-active");
        }
        currentEntry = entry;
        entry.classList.add("entry-active");
        view.setActiveImage(entry.dataset.name);
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
