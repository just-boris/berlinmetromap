function addElement(tag, className, parent) {
  const element = document.createElement(tag);
  element.className = className;
  parent.appendChild(element);
  return element;
}

const transparent = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`;

class ImageView {
  constructor() {
    this.el = document.querySelector(".map");
    this.spinner = addElement("div", "spinner spinner-hidden", this.el);
    this.spinner.innerHTML = `
      <div class="spinner-fig-1"></div>
      <div class="spinner-fig-2"></div>
      <div class="spinner-fig-3"></div>
    `;
    this.fullMap = addElement("img", "map-full", this.el);
    this.zoomMap = addElement("img", "map-zoom", this.el);
    this.zoomMap.style.display = "none";
    this.el.addEventListener("mouseenter", event => (this.zoomMap.style.display = ""));
    this.el.addEventListener("mousemove", event => this.setZoomPosition(event));
    this.el.addEventListener("mouseleave", event => (this.zoomMap.style.display = "none"));
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
    this.zoomMap.style.objectPosition = `${left}% ${top}%`;
  }

  setActiveImage(name) {
    this.fullMap.src = transparent;
    this.zoomMap.src = transparent;
    this.spinner.classList.remove("spinner-hidden");
    imagesLoader.getImage(name).then(src => {
      this.fullMap.src = src;
      this.zoomMap.src = src;
      this.spinner.classList.add("spinner-hidden");
    });
  }
}

class ImagesLoader {
  constructor() {
    this.loading = {};
  }

  getImage(name) {
    if (!this.loading[name]) {
      this.loading[name] = this.loadImage(`/images/S_und_U-${name}.png`);
    }
    return this.loading[name];
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = reject;
    });
  }

  doImagesPreload(items) {
    setTimeout(() => {
      items.reduce((promise, src) => promise.then(() => this.getImage(src)), Promise.resolve());
    }, 1000);
  }
}

let currentEntry;
const imagesLoader = new ImagesLoader();
const view = new ImageView();

imagesLoader.doImagesPreload(
  Array.from(document.querySelectorAll(".entry")).map(entry => entry.dataset.name)
);

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

window.addEventListener("scroll", event => {
  const topEntry = Array.from(document.querySelectorAll(".entry")).find(
    node => node.getBoundingClientRect().top > 0
  );

  if (topEntry) {
    setActive(topEntry);
  }
});
