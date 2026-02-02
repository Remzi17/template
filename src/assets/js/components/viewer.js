/* 
	================================================
	  
	Галерея
	
	================================================
*/

export function viewer() {
  const galleries = document.querySelectorAll("[data-viewer]");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    if (gallery.classList.contains("viewer_init")) return;

    let items = [];
    let galleryItems = gallery.querySelectorAll("[data-viewer-item], a");

    galleryItems.forEach((item) => {
      let src = item.getAttribute("href");
      if (!src) return;

      let title = item.getAttribute("data-title") || item.querySelector("img")?.alt;
      let description = item.getAttribute("data-description");
      let button = item.getAttribute("data-button");
      let buttonHref = item.getAttribute("data-button-href");
      let fit = item.getAttribute("data-fit");

      items.push({
        src,
        title: title === "false" ? false : title || undefined,
        description: description || undefined,
        button: button || undefined,
        onclick: buttonHref ? () => eval(buttonHref) : undefined,
        fit: fit || undefined,
      });
    });

    if (!items.length) return;

    gallery.addEventListener("click", (e) => {
      const target = e.target.closest("[data-viewer-item], a");
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      let index = Array.from(galleryItems).indexOf(target);

      Spotlight.show(items, {
        index: index + 1,
        animation: "slide,fade,scale",
        control: "page,zoom,autofit,fullscreen,download,play,close",
        zoom: true,
        autofit: true,
        fullscreen: true,
        download: true,
        play: false,
        // autoslide: 5,
        progress: true,
        close: true,
        page: true,
      });

      let spotlightClosing = false;

      document.addEventListener(
        "pointerdown",
        (e) => {
          const pane = e.target.closest(".spl-pane");
          const img = e.target.closest("img");

          if (!pane || img) return;

          if (spotlightClosing) {
            return;
          }

          spotlightClosing = true;
          Spotlight.close();
        },
        true
      );
    });

    gallery.classList.add("viewer_init");
  });
}
