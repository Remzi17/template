import "./scripts/init.js";
import "./components.js";

//
//
//
//
// Общие скрипты

if (document.querySelector(".about-container")) {
  let aboutSlider = new Swiper(".about-container", {
    autoplay: {
      delay: 4000,
      pauseOnMouseEnter: true,
    },
    loop: true,
    resistanceRatio: 0,

    pagination: {
      el: ".about__pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".about__next",
      prevEl: ".about__prev",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    spaceBetween: 12,
    speed: 500,
    breakpoints: {
      1: {},
      1200: {},
    },
  });
}
