(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", {
    value,
    configurable: true
  });

  // src/assets/js/scripts/variables.js
  var body = document.querySelector("body");
  var html2 = document.querySelector("html");
  var popup = document.querySelectorAll(".popup");
  var headerTop = document.querySelector(".header") ? document.querySelector(".header") : document.querySelector("head");
  var headerTopFixed = "header_fixed";
  var fixedHeader = true;
  var fixedElements = document.querySelectorAll("[data-fixed]");
  var stickyObservers2 = /* @__PURE__ */ new Map();
  var menuClass = ".header__mobile";
  var menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector("head");
  var menuLink = document.querySelector(".menu-link") ? document.querySelector(".menu-link") : document.querySelector("head");
  var menuActive = "active";
  var burgerMedia = 991;
  var bodyOpenModalClass2 = "popup-show";
  var windowWidth = window.innerWidth;
  var containerWidth = document.querySelector(".container").offsetWidth || 0;
  var checkWindowWidth = /* @__PURE__ */ __name(() => {
    windowWidth = window.innerWidth;
    containerWidth = document.querySelector(".container").offsetWidth || 0;
  }, "checkWindowWidth");

  // src/assets/js/scripts/core/helpers.js
  function debounce(fn, delay) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }
  __name(debounce, "debounce");
  window.addEventListener("resize", debounce(checkWindowWidth, 100));

  function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }
  __name(throttle, "throttle");

  function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
  __name(randomInteger, "randomInteger");

  function uniqArray2(array) {
    return array.filter(function(item, index, self) {
      return self.indexOf(item) === index;
    });
  }
  __name(uniqArray2, "uniqArray");

  function setCaret(item) {
    let data = item.value;
    item.focus();
    item.value = "";
    item.value = data;
  }
  __name(setCaret, "setCaret");

  function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
    document.addEventListener("click", (e) => {
      const button = document.querySelector(clickedButton);
      const element = document.querySelector(closedElement);
      const withinBoundaries = e.composedPath().includes(element);
      if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button && !e.target.closest(".popup")) {
        button.click();
        if (typeof callback === "function") {
          callback();
        }
      }
    });
  }
  __name(closeOutClick, "closeOutClick");

  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      right: windowWidth - rect.width - (rect.left + scrollLeft)
    };
  }
  __name(offset, "offset");

  function getPageSide(item) {
    if (offset(item).left > windowWidth / 2) {
      return "right";
    } else {
      return "left";
    }
  }
  __name(getPageSide, "getPageSide");

  function indexInParent(node) {
    let children = node.parentNode.childNodes;
    let num = 0;
    for (var i = 0; i < children.length; i++) {
      if (children[i] == node) return num;
      if (children[i].nodeType == 1) num++;
    }
    return -1;
  }
  __name(indexInParent, "indexInParent");
  var wrap = /* @__PURE__ */ __name((query, tag, wrapContent = false) => {
    let elements;
    let tagName = tag.split(".")[0] || "div";
    let tagClass = tag.split(".").slice(1);
    tagClass = tagClass.length > 0 ? tagClass : [];
    if (typeof query === "object") {
      elements = query;
    } else {
      elements = document.querySelectorAll(query);
    }

    function createWrapElement(item) {
      let newElement = document.createElement(tagName);
      if (tagClass.length) {
        newElement.classList.add(...tagClass);
      }
      if (wrapContent) {
        while (item.firstChild) {
          newElement.appendChild(item.firstChild);
        }
        item.appendChild(newElement);
      } else {
        item.parentElement.insertBefore(newElement, item);
        newElement.appendChild(item);
      }
    }
    __name(createWrapElement, "createWrapElement");
    if (elements.length) {
      for (let i = 0; i < elements.length; i++) {
        createWrapElement(elements[i]);
      }
    } else {
      if (elements.parentElement) {
        createWrapElement(elements);
      }
    }
  }, "wrap");
  wrap("table", ".table");

  // src/assets/js/scripts/ui/browser.js
  function isMobile2() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
  }
  __name(isMobile2, "isMobile");

  function isDesktop() {
    return windowWidth > burgerMedia;
  }
  __name(isDesktop, "isDesktop");

  function checkWebp() {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      if (webP.height !== 2) {
        document.querySelectorAll("[style]").forEach((item) => {
          const styleAttr = item.getAttribute("style");
          if (styleAttr.indexOf("background-image") === 0) {
            item.setAttribute("style", styleAttr.replace(".webp", ".jpg"));
          }
        });
      }
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  __name(checkWebp, "checkWebp");
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // src/assets/js/scripts/core/checks.js
  function haveScroll() {
    return document.documentElement.scrollHeight !== document.documentElement.clientHeight;
  }
  __name(haveScroll, "haveScroll");

  function isHidden(el) {
    return window.getComputedStyle(el).display === "none";
  }
  __name(isHidden, "isHidden");

  function checkBurgerAndMenu() {
    if (isDesktop()) {
      menuLink.classList.remove("active");
      if (menu) {
        menu.classList.remove(menuActive);
        if (!body.classList.contains(bodyOpenModalClass2)) {
          body.classList.remove("no-scroll");
        }
      }
    }
    if (html2.classList.contains("lg-on")) {
      if (isMobile()) {
        body.style.paddingRight = "0";
      } else {
        body.style.paddingRight = getScrollBarWidth() + "px";
      }
    }
  }
  __name(checkBurgerAndMenu, "checkBurgerAndMenu");

  function watchElements(callback) {
    const elements = document.querySelectorAll("[data-watch]");
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const {
            target,
            isIntersecting
          } = entry;
          const toggleClass = target.hasAttribute("data-watch-toggle");
          if (isIntersecting) {
            target.classList.add("visible");
            if (typeof callback === "function") callback(target);
          } else if (toggleClass) {
            target.classList.remove("visible");
          }
        });
      }, {
        threshold: 0.1
      }
    );
    elements.forEach((el) => observer.observe(el));
  }
  __name(watchElements, "watchElements");

  function dataMediaQueries(array, dataSetValue) {
    let media = Array.from(array).filter(function(item) {
      if (item.dataset[dataSetValue]) {
        return item.dataset[dataSetValue].split(",")[0];
      }
    });
    if (media.length) {
      let breakpointsArray = [];
      media.forEach((item) => {
        let params = item.dataset[dataSetValue];
        let breakpoint = {};
        let paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });
      let mdQueries = breakpointsArray.map(function(item) {
        return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
      });
      mdQueries = uniqArray(mdQueries);
      let mdQueriesArray = [];
      if (mdQueries.length) {
        mdQueries.forEach((breakpoint) => {
          let paramsArray = breakpoint.split(",");
          let mediaBreakpoint = paramsArray[1];
          let mediaType = paramsArray[2];
          let matchMedia = window.matchMedia(paramsArray[0]);
          let itemsArray = breakpointsArray.filter(function(item) {
            return item.value === mediaBreakpoint && item.type === mediaType;
          });
          mdQueriesArray.push({
            itemsArray,
            matchMedia
          });
        });
        return mdQueriesArray;
      }
    }
  }
  __name(dataMediaQueries, "dataMediaQueries");

  // src/assets/js/scripts/core/dom.js
  if (!document.querySelector("body").classList.contains("home") && document.querySelector("body").classList.contains("wp")) {
    let menu2 = document.querySelectorAll(".menu li a");
    for (let i = 0; i < menu2.length; i++) {
      if (menu2[i].getAttribute("href").indexOf("#") > -1) {
        menu2[i].setAttribute("href", "/" + menu2[i].getAttribute("href"));
      }
    }
  }

  function loaded() {
    document.addEventListener("DOMContentLoaded", function() {
      html2.classList.add("loaded");
      if (document.querySelector("header")) {
        document.querySelector("header").classList.add("loaded");
      }
      if (haveScroll()) {
        setTimeout(() => {
          html2.classList.remove("scrollbar-auto");
        }, 500);
      }
    });
  }
  __name(loaded, "loaded");
  if (window.location.hostname == "localhost" || window.location.hostname.includes("192.168")) {
    document.querySelectorAll(".logo, .crumbs>li:first-child>a").forEach((logo) => {
      logo.setAttribute("href", "/");
    });
    document.querySelectorAll(".menu a").forEach((item) => {
      let firstSlash = 0;
      let lastSlash = 0;
      if (item.href.split("/").length - 1 == 4) {
        for (let i = 0; i < item.href.length; i++) {
          if (item.href[i] == "/") {
            if (i > 6 && firstSlash == 0) {
              firstSlash = i;
              continue;
            }
            if (i > 6 && lastSlash == 0) {
              lastSlash = i;
            }
          }
        }
        let newLink = "";
        let removeProjectName = "";
        for (let i = 0; i < item.href.length; i++) {
          if (i > firstSlash && i < lastSlash + 1) {
            removeProjectName += item.href[i];
          }
        }
        newLink = item.href.replace(removeProjectName, "");
        item.href = newLink;
      }
    });
  }

  // src/assets/js/scripts/init.js
  if (isSafari) document.documentElement.classList.add("safari");
  checkWebp();
  window.addEventListener("resize", debounce(checkBurgerAndMenu, 100));
  checkBurgerAndMenu();
  loaded();

  function setHeaderFixedHeight() {
    if (!headerTop) return;
    requestAnimationFrame(() => {
      const height = headerTop.offsetHeight;
      document.documentElement.style.setProperty("--headerFixedHeight", height + "px");
    });
  }
  __name(setHeaderFixedHeight, "setHeaderFixedHeight");
  document.addEventListener("DOMContentLoaded", setHeaderFixedHeight);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      setHeaderFixedHeight();
    });
    ro.observe(headerTop);
  }

  // src/assets/js/components/slider.js
  function slider() {
    function adaptiveSlider(match, settings) {
      if (settings[0]) {
        let slider2;
        let breakpoint = window.matchMedia(`(${match})`);
        let breakpointChecker = /* @__PURE__ */ __name(function() {
          if (breakpoint.matches === true) {
            return enableSwiper();
          } else if (breakpoint.matches === false) {
            if (slider2 !== void 0) {
              slider2.destroy(true, true);
            }
            return;
          }
        }, "breakpointChecker");
        let enableSwiper = /* @__PURE__ */ __name(function() {
          slider2 = new Swiper(settings[0], settings[1]);
        }, "enableSwiper");
        breakpoint.addListener(breakpointChecker);
        breakpointChecker();
      }
    }
    __name(adaptiveSlider, "adaptiveSlider");
  }
  __name(slider, "slider");

  // src/assets/js/scripts/ui/scrollbar.js
  function hideScrollbar() {
    popup.forEach((element) => {
      element.style.display = "none";
    });
    if (haveScroll()) {
      body.classList.add("no-scroll");
    }
    changeScrollbarPadding();
  }
  __name(hideScrollbar, "hideScrollbar");

  function showScrollbar() {
    if (!menu.classList.contains(menuActive)) {
      body.classList.remove("no-scroll");
    }
    changeScrollbarPadding(false);
  }
  __name(showScrollbar, "showScrollbar");

  function getScrollBarWidth2() {
    let div = document.createElement("div");
    div.style.overflowY = "scroll";
    div.style.width = "50px";
    div.style.height = "50px";
    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();
    if (haveScroll()) {
      return scrollWidth;
    } else {
      return 0;
    }
  }
  __name(getScrollBarWidth2, "getScrollBarWidth");

  function changeScrollbarGutter2(add = true) {
    if (haveScroll()) {
      if (add) {
        body.classList.add(bodyOpenModalClass, "scrollbar-auto");
        html.classList.add("scrollbar-auto");
      } else {
        body.classList.remove(bodyOpenModalClass, "scrollbar-auto");
        html.classList.remove("scrollbar-auto");
      }
    }
  }
  __name(changeScrollbarGutter2, "changeScrollbarGutter");

  function changeScrollbarPadding(add = true) {
    const scrollbarPadding = getScrollBarWidth2() + "px";
    fixedElements.forEach((elem) => {
      const position = window.getComputedStyle(elem).position;
      if (position === "sticky") {
        if (add) {
          if (!stickyObservers.has(elem)) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (!entry.isIntersecting) {
                  elem.style.paddingRight = scrollbarPadding;
                } else {
                  elem.style.paddingRight = "0";
                }
              }, {
                threshold: [1]
              }
            );
            observer.observe(elem);
            stickyObservers.set(elem, observer);
          }
        } else {
          elem.style.paddingRight = "0";
          const observer = stickyObservers.get(elem);
          if (observer) {
            observer.unobserve(elem);
            stickyObservers.delete(elem);
          }
        }
      } else {
        elem.style.paddingRight = add ? scrollbarPadding : "0";
      }
    });
    if (isSafari) {
      body.style.paddingRight = add ? scrollbarPadding : "0";
    }
  }
  __name(changeScrollbarPadding, "changeScrollbarPadding");

  // src/assets/js/components/gallery.js
  function gallery() {
    let galleries = document.querySelectorAll("[data-gallery]");
    if (galleries.length) {
      galleries.forEach((gallery2) => {
        if (!gallery2.classList.contains("gallery_init")) {
          let selector = false;
          if (gallery2.querySelectorAll("[data-gallery-item]").length) {
            selector = "[data-gallery-item]";
          } else if (gallery2.classList.contains("swiper-wrapper")) {
            selector = ".swiper-slide>a";
          } else if (gallery2.tagName == "A") {
            selector = false;
          } else {
            selector = "a";
          }
          lightGallery(gallery2, {
            plugins: [lgZoom, lgThumbnail],
            licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
            speed: 300,
            selector,
            mousewheel: true,
            zoomFromOrigin: false,
            mobileSettings: {
              controls: false,
              showCloseIcon: true,
              download: true
            },
            subHtmlSelectorRelative: true
          });
          gallery2.classList.add("gallery_init");
          gallery2.addEventListener("lgBeforeOpen", () => {
            if (!body.classList.contains(bodyOpenModalClass2)) {
              hideScrollbar();
            }
          });
          gallery2.addEventListener("lgBeforeClose", () => {
            showScrollbar();
          });
        }
      });
    }
  }
  __name(gallery, "gallery");

  // src/assets/js/components/rating.js
  function rating() {
    const ratings = document.querySelectorAll(".rating__item");
    ratings.forEach(initRating);

    function initRating(rating2) {
      const ratingActive = rating2.querySelector(".rating__active");
      const ratingValue = rating2.querySelector(".rating__value");
      const ratingInputs = rating2.querySelectorAll("input");
      setRatingActiveWidth(ratingActive, ratingValue, ratingInputs.length);
      if (rating2.classList.contains("rating__item_set")) {
        setRating(rating2, ratingActive, ratingValue, ratingInputs.length);
      }
    }
    __name(initRating, "initRating");

    function setRatingActiveWidth(ratingActive, ratingValue, totalStars, index = null) {
      const value = index !== null ? index : ratingValue.innerHTML;
      const ratingActiveWidth = 100 / totalStars * value;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    __name(setRatingActiveWidth, "setRatingActiveWidth");

    function setRating(rating2, ratingActive, ratingValue, totalStars) {
      const ratingItems = rating2.querySelectorAll(".rating__items input");
      ratingItems.forEach((ratingItem, index) => {
        ratingItem.addEventListener("mouseenter", () => {
          setRatingActiveWidth(ratingActive, ratingValue, totalStars, ratingItem.value);
        });
        ratingItem.addEventListener("mouseleave", () => {
          setRatingActiveWidth(ratingActive, ratingValue, totalStars);
        });
        ratingItem.addEventListener("click", () => {
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth(ratingActive, ratingValue, totalStars);
        });
      });
    }
    __name(setRating, "setRating");
  }
  __name(rating, "rating");

  // src/assets/js/components/fixedMenu.js
  function fixedMenu() {
    if (!headerTop) return;
    const isFixed = isDesktop() && window.scrollY > 180;
    if (isFixed) {
      headerTop.classList.add(headerTopFixed);
    } else {
      headerTop.classList.remove(headerTopFixed);
    }
  }
  __name(fixedMenu, "fixedMenu");
  window.addEventListener("scroll", throttle(fixedMenu, 100));
  window.addEventListener("resize", throttle(fixedMenu, 100));

  function observeStickyPosition(elOrSelector, stuckClass = "sticky") {
    const stickyEl = typeof elOrSelector === "string" ? document.querySelector(elOrSelector) : elOrSelector instanceof Element ? elOrSelector : null;
    if (!stickyEl) return;
    const topOffset = parseInt(getComputedStyle(stickyEl).top) || 0;

    function checkSticky() {
      const rect = stickyEl.getBoundingClientRect();
      if (Math.round(rect.top) <= topOffset) {
        stickyEl.classList.add(stuckClass);
      } else {
        stickyEl.classList.remove(stuckClass);
      }
    }
    __name(checkSticky, "checkSticky");
    checkSticky();
    window.addEventListener("scroll", throttle(checkSticky, 100));
    window.addEventListener("resize", throttle(checkSticky, 100));
  }
  __name(observeStickyPosition, "observeStickyPosition");

  // src/assets/js/components/tooltip.js
  function tooltip() {
    let tooltipItems = document.querySelectorAll("[data-tooltip]");
    let calculatePosTooltip = /* @__PURE__ */ __name((item) => {
      tooltip = item.querySelector(".tooltip");
      if (getPageSide(item) == "left") {
        tooltip.style.left = 0;
        tooltip.style.bottom = item.offsetHeight + "px";
      } else {
        tooltip.style.right = 0;
        tooltip.style.bottom = item.offsetHeight + "px";
      }
    }, "calculatePosTooltip");

    function createTooltips() {
      tooltipItems.forEach((item) => {
        let timer, tooltip2, tooltipText;
        let tooltipIsHtml = item.getAttribute("data-tooltip") == "html" ? true : false;
        if (item.hasAttribute("title")) {
          tooltipText = item.getAttribute("title");
        } else if (item.getAttribute("data-tooltip") != "") {
          tooltipText = item.getAttribute("data-tooltip");
        } else {
          tooltipText = "";
        }
        if (tooltipIsHtml) {
          tooltip2 = item.querySelector(".tooltip");
        } else {
          tooltip2 = document.createElement("div");
          item.append(tooltip2);
          tooltip2.classList.add("tooltip");
          tooltip2.textContent = tooltipText;
        }
        calculatePosTooltip(item);
        item.addEventListener("mouseenter", () => {
          tooltip2.classList.add("tooltip_active");
        });
        item.addEventListener("focusin", () => {
          tooltip2.classList.add("tooltip_active");
        });
        item.addEventListener("mouseleave", () => {
          timer = setTimeout(() => {
            tooltip2.classList.remove("tooltip_active");
          }, 200);
        });
        item.addEventListener("focusout", () => {
          timer = setTimeout(() => {
            tooltip2.classList.remove("tooltip_active");
          }, 200);
        });
        tooltip2.addEventListener("mouseenter", () => clearTimeout(timer));
        tooltip2.addEventListener("mouseleave", () => tooltip2.classList.remove("tooltip_active"));
      });
    }
    __name(createTooltips, "createTooltips");
    createTooltips();
  }
  __name(tooltip, "tooltip");

  // src/assets/js/scripts/ui/animation.js
  var fadeIn = /* @__PURE__ */ __name((el, isItem = false, display, timeout = 400) => {
    document.body.classList.add("_fade");
    let elements = isItem ? el : document.querySelectorAll(el);
    if (elements.length > 0) {
      elements.forEach((element) => {
        element.style.opacity = 0;
        element.style.display = display || "block";
        element.style.transition = `opacity ${timeout}ms`;
        setTimeout(() => {
          element.style.opacity = 1;
          setTimeout(() => {
            document.body.classList.remove("_fade");
          }, timeout);
        }, 10);
      });
    } else {
      el.style.opacity = 0;
      el.style.display = display || "block";
      el.style.transition = `opacity ${timeout}ms`;
      setTimeout(() => {
        el.style.opacity = 1;
        setTimeout(() => {
          document.body.classList.remove("_fade");
        }, timeout);
      }, 10);
    }
  }, "fadeIn");
  var fadeOut = /* @__PURE__ */ __name((el, isItem = false, timeout = 400) => {
    document.body.classList.add("_fade");
    let elements = isItem ? el : document.querySelectorAll(el);
    if (elements.length > 0) {
      elements.forEach((element) => {
        element.style.opacity = 1;
        element.style.transition = `opacity ${timeout}ms`;
        element.style.opacity = 0;
        setTimeout(() => {
          element.style.display = "none";
          setTimeout(() => {
            document.body.classList.remove("_fade");
          }, timeout);
        }, timeout);
        setTimeout(() => {
          element.removeAttribute("style");
        }, timeout + 400);
      });
    } else {
      el.style.opacity = 1;
      el.style.transition = `opacity ${timeout}ms`;
      el.style.opacity = 0;
      setTimeout(() => {
        el.style.display = "none";
        setTimeout(() => {
          document.body.classList.remove("_fade");
        }, timeout);
      }, timeout);
      setTimeout(() => {
        el.removeAttribute("style");
      }, timeout + 400);
    }
  }, "fadeOut");
  var _slideUp2 = /* @__PURE__ */ __name((target, duration = 400, showmore = 0) => {
    if (target && !target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingBlock = 0;
      target.style.marginBlock = 0;
      window.setTimeout(() => {
        target.style.display = !showmore ? "none" : "block";
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(
          new CustomEvent("slideUpDone", {
            detail: {
              target
            }
          })
        );
      }, duration);
    }
  }, "_slideUp");
  var _slideDown2 = /* @__PURE__ */ __name((target, duration = 400) => {
    if (target && !target.classList.contains("_slide")) {
      target.style.removeProperty("display");
      let display = window.getComputedStyle(target).display;
      if (display === "none") display = "block";
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingBLock = 0;
      target.style.marginBlock = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
      }, duration);
    }
  }, "_slideDown");
  var _slideToggle = /* @__PURE__ */ __name((target, duration = 400) => {
    if (target && isHidden(target)) {
      return _slideDown2(target, duration);
    } else {
      return _slideUp2(target, duration);
    }
  }, "_slideToggle");

  // src/assets/js/scripts/forms/validation.js
  var inputs = document.querySelectorAll("input, textarea");

  function clearInputs() {
    inputs.forEach((element) => {
      element.classList.remove("wpcf7-not-valid", "error");
    });
  }
  __name(clearInputs, "clearInputs");

  function checkInputDateValue(input) {
    input.classList.toggle("empty", input.value.length === 0);
  }
  __name(checkInputDateValue, "checkInputDateValue");
  inputs.forEach((input) => {
    if (!input) return;
    const parentElement = input.parentElement;
    const updateActiveState = /* @__PURE__ */ __name(() => {
      if (input.type === "text" || input.type === "date") {
        parentElement.classList.toggle("active", input.value.length > 0);
      }
    }, "updateActiveState");
    const validateFIOField = /* @__PURE__ */ __name(() => {
      const nameAttr = input.name.toLowerCase() || "";
      const placeholder = input.placeholder.toLowerCase() || "";
      const fioKeywords = ["\u0438\u043C\u044F", "\u0444\u0430\u043C\u0438\u043B\u0438\u044F", "\u043E\u0442\u0447\u0435\u0441\u0442\u0432\u043E"];
      const isFIO = nameAttr.includes("name") || fioKeywords.some((word) => placeholder.includes(word));
      if (isFIO) {
        input.value = input.value.replace(/[^а-яА-ЯёЁ\s]/g, "");
        input.value = input.value.replace(/\s{2,}/g, " ");
      }
    }, "validateFIOField");
    input.addEventListener("keyup", updateActiveState);
    input.addEventListener("change", () => {
      input.classList.remove("wpcf7-not-valid");
      updateActiveState();
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("data-number")) {
        input.value = input.value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
      }
      if (input.type === "email") {
        input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
      }
      validateFIOField();
    });
    input.addEventListener("paste", (e) => {
      setTimeout(() => {
        if (input.type === "email") {
          input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
        }
        validateFIOField();
        updateActiveState();
      }, 0);
    });
  });

  function initFormValidation(form2) {
    const checkRequiredChoice2 = /* @__PURE__ */ __name(() => {
      let requiredChoice2 = form2.querySelectorAll("[data-required-choice]");
      let hasValue = Array.from(requiredChoice2).some((input) => input.value.trim() !== "" && input.value !== "+7 ");
      requiredChoice2.forEach((input) => {
        if (!hasValue) {
          input.setAttribute("required", "true");
        } else {
          input.removeAttribute("required");
        }
      });
    }, "checkRequiredChoice");
    checkRequiredChoice2();
    form2.addEventListener(
      "submit",
      (e) => {
        let isValid = true;
        form2.querySelectorAll('input[type="tel"]').forEach((input) => {
          const val = input.value.trim();
          const requiredLength = val.startsWith("+7") ? 17 : val.startsWith("8") ? 16 : Infinity;
          if (val.length < requiredLength && val.length > 3) {
            input.setCustomValidity("\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 11 \u0446\u0438\u0444\u0440");
            input.reportValidity();
            e.preventDefault();
            isValid = false;
          } else {
            input.setCustomValidity("");
          }
        });
        checkRequiredChoice2();
        if (!isValid || !form2.checkValidity()) e.preventDefault();
      }, {
        capture: true
      }
    );
    let requiredChoice = form2.querySelectorAll("[data-required-choice]");
    requiredChoice.forEach((input) => {
      input.addEventListener("input", checkRequiredChoice2);
    });
  }
  __name(initFormValidation, "initFormValidation");
  document.querySelectorAll("form").forEach(initFormValidation);

  function successSubmitForm(form2) {
    let popupInterval = 1500;
    fadeOut(".popup");
    setTimeout(() => {
      fadeIn(".popup-thank");
    }, popupInterval - 500);
    setTimeout(() => {
      fadeOut(".popup");
    }, popupInterval * 2);
    setTimeout(() => {
      body.classList.remove("no-scroll");
    }, popupInterval * 3);
    form2.reset();
    form2.querySelectorAll("[data-original-placeholder]").forEach((input) => {
      input.placeholder = input.getAttribute("data-original-placeholder");
    });
  }
  __name(successSubmitForm, "successSubmitForm");
  if (typeof window !== "undefined") {
    window.successSubmitForm = successSubmitForm;
  }

  // src/assets/js/components/form.js
  function form() {
    const allForms = document.querySelectorAll("form");
    allForms.forEach((form2) => {
      if (form2.classList.contains("wpcf7-form")) return;
      if (!form2.hasAttribute("enctype")) {
        form2.setAttribute("enctype", "multipart/form-data");
      }
      form2.addEventListener("submit", async (e) => {
        e.preventDefault();
        let isValid = true;
        form2.querySelectorAll('input[type="tel"]').forEach((input) => {
          const val = input.value.trim();
          const requiredLength = val.startsWith("+7") ? 17 : val.startsWith("8") ? 16 : Infinity;
          if (val.length < requiredLength && val.length > 3) {
            input.setCustomValidity("\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C 11 \u0446\u0438\u0444\u0440");
            input.reportValidity();
            isValid = false;
          } else {
            input.setCustomValidity("");
          }
        });
        if (typeof checkRequiredChoice === "function") {
          checkRequiredChoice();
        }
        if (!isValid || !form2.checkValidity()) {
          form2.reportValidity();
          return;
        }
        form2.classList.add("sending");
        try {
          const formData = new FormData(form2);
          const mailResponse = await fetch("/mail.php", {
            method: "POST",
            body: formData
          });
          const wpFormData = new FormData(form2);
          wpFormData.append("action", "submit_request");
          const wpResponse = await fetch("/wp-admin/admin-ajax.php", {
            method: "POST",
            body: wpFormData,
            credentials: "same-origin"
          });
          const wpResult = await wpResponse.json();
          if (mailResponse.ok && wpResult.success) {
            successSubmitForm(form2);
          } else {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435:", {
              mail: mailResponse,
              wp: wpResult
            });
          }
        } catch (err) {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0442\u0438:", err);
        } finally {
          form2.classList.remove("sending");
        }
      });
    });
  }
  __name(form, "form");

  // src/assets/js/components/map.js
  function map() {
    let spinner = document.querySelectorAll(".loader");
    let check_if_load = false;

    function loadScript(url, callback) {
      let script = document.createElement("script");
      if (script.readyState) {
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function() {
          callback();
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    __name(loadScript, "loadScript");

    function initMap() {
      loadScript("https://api-maps.yandex.ru/2.1/?apikey=5b7736c7-611f-40ce-a5a8-b7fd86e6737c&lang=ru_RU&amp;loadByRequire=1", function() {
        ymaps.load(init);
      });
      check_if_load = true;
    }
    __name(initMap, "initMap");
    if (document.querySelectorAll(".map").length) {
      let observer = new IntersectionObserver(
        function(entries) {
          if (entries[0]["isIntersecting"] === true) {
            if (!check_if_load) {
              spinner.forEach((element) => {
                element.classList.add("is-active");
              });
              if (entries[0]["intersectionRatio"] > 0.1) {
                initMap();
              }
            }
          }
        }, {
          threshold: [0, 0.1, 0.2, 0.5, 1],
          rootMargin: "200px 0px"
        }
      );
      observer.observe(document.querySelector(".map"));
    }
  }
  __name(map, "map");

  function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function(resolve, reject) {
      let tc = getTileContainer(layer),
        readyAll = true;
      tc.tiles.each(function(tile, number) {
        if (!tile.isReady()) {
          readyAll = false;
        }
      });
      if (readyAll) {
        resolve();
      } else {
        tc.events.once("ready", function() {
          resolve();
        });
      }
    });
  }
  __name(waitForTilesLoad, "waitForTilesLoad");

  function getTileContainer(layer) {
    for (let k in layer) {
      if (layer.hasOwnProperty(k)) {
        if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
          return layer[k];
        }
      }
    }
    return null;
  }
  __name(getTileContainer, "getTileContainer");
  window.waitForTilesLoad = waitForTilesLoad;
  window.getTileContainer = getTileContainer;

  // src/assets/js/components/burger.js
  function burger() {
    if (menuLink) {
      let checkHeaderOffset = function() {
        if (isMobile2()) {
          changeScrollbarPadding(false);
        } else {
          if (body.classList.contains(bodyOpenModalClass2)) {
            changeScrollbarPadding();
          }
        }
        if (isDesktop()) {
          menu.removeAttribute("style");
          if (!body.classList.contains(bodyOpenModalClass2)) {
            body.classList.remove("no-scroll");
            if (isSafari) {
              changeScrollbarPadding(false);
            }
          }
        }
      };
      __name(checkHeaderOffset, "checkHeaderOffset");
      let isAnimating = false;
      menuLink.addEventListener("click", function(e) {
        if (isAnimating) return;
        isAnimating = true;
        menuLink.classList.toggle("active");
        menu.classList.toggle(menuActive);
        if (menu.classList.contains(menuActive)) {
          hideScrollbar();
          const scrollY = window.scrollY;
          const headerHeight = headerTop.offsetHeight;
          if (scrollY === 0) {
            menu.style.removeProperty("top");
          } else if (scrollY < headerHeight) {
            menu.style.top = scrollY + "px";
          } else {
            const headerRect = headerTop.getBoundingClientRect();
            menu.style.top = headerRect.bottom + "px";
          }
        } else {
          setTimeout(() => {
            showScrollbar();
          }, 400);
        }
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      });
      window.addEventListener("resize", debounce(checkHeaderOffset, 50));
      window.addEventListener("resize", debounce(checkHeaderOffset, 150));
      if (document.querySelector(".header__mobile")) {
        closeOutClick(".header__mobile", ".menu-link", "active");
      }
    }
  }
  __name(burger, "burger");

  // src/assets/js/components/numbers.js
  function numbers() {
    function digitsCountersInit(digitsCountersItems) {
      let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
      if (digitsCounters) {
        digitsCounters.forEach((digitsCounter) => {
          if (digitsCounter.classList.contains("active")) {
            digitsCounter.innerHTML = "0";
          } else {
            digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(" ", "").replace(",", ".");
          }
          digitsCounter.style.width = digitsCounter.offsetWidth + "px";
          if (parseFloat(digitsCounter.innerHTML.replace(",", ".")) % 1 != 0) {
            digitsCounter.setAttribute("data-float", true);
          }
          digitsCountersAnimate(digitsCounter);
        });
      }
    }
    __name(digitsCountersInit, "digitsCountersInit");

    function digitsCountersAnimate(digitsCounter) {
      let startTimestamp = null;
      const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1e3;
      const startValue = parseFloat(digitsCounter.dataset.originalValue.replace(/[^0-9]/g, "")) || 0;
      const startPosition = 0;
      digitsCounter.classList.add("active");
      const step = /* @__PURE__ */ __name((timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        if (digitsCounter.getAttribute("data-float")) {
          digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace(".", ",");
        } else {
          digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
          digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }, "step");
      window.requestAnimationFrame(step);
      setTimeout(() => {
        digitsCounter.removeAttribute("style");
      }, duration + 500);
    }
    __name(digitsCountersAnimate, "digitsCountersAnimate");
    let options = {
      threshold: 0.6
    };
    let observer = new IntersectionObserver((entries, observer2) => {
      entries.forEach((entry) => {
        const targetElement = entry.target;
        const digitsCountersItems = targetElement.querySelectorAll("[data-digits-counter]");
        if (entry.isIntersecting) {
          if (digitsCountersItems.length) {
            digitsCountersInit(digitsCountersItems);
          }
        } else {
          digitsCountersItems.forEach((item) => item.classList.remove("active"));
        }
      });
    }, options);
    let sections = document.querySelectorAll('[class*="section"], .about__items');
    if (sections.length) {
      sections.forEach((section) => observer.observe(section));
    }
  }
  __name(numbers, "numbers");

  // src/assets/js/components/video.js
  function video() {
    const _LazyVideo = class _LazyVideo {
      constructor(videoUrl, options = {}) {
        let defaultOptions = {
          isFile: false
        };
        this.options = Object.assign(defaultOptions, options);
        this.isFile = options.isFile;
        this.container = options.container;
        this.videoUrl = this.normalizeUrl(videoUrl);
        if (this.container) {
          this.thumbnail = this.container.querySelector(".video__thumbnail");
          this.playButton = this.container.querySelector(".video__play");
        } else {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430: \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0431\u043B\u043E\u043A .video");
          return;
        }
        this.check();
        this.init();
      }
      check() {
        if (!this.videoUrl) {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430: \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0430\u0434\u0440\u0435\u0441 \u0432\u0438\u0434\u0435\u043E");
          return;
        }
        if (!this.playButton) {
          console.error("\u041E\u0448\u0438\u0431\u043A\u0430: \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0430");
          return;
        }
      }
      init() {
        this.playButton?.addEventListener("click", () => this.loadVideo());
      }
      loadVideo() {
        this.thumbnail.remove();
        this.playButton.remove();
        if (this.isFile) {
          const video2 = document.createElement("video");
          video2.src = this.videoUrl;
          video2.controls = true;
          video2.autoplay = true;
          this.container.appendChild(video2);
        } else {
          const iframe = document.createElement("iframe");
          iframe.src = `${this.videoUrl}${this.videoUrl.includes("?") ? "&" : "?"}autoplay=1`;
          iframe.allow = "autoplay; encrypted-media";
          iframe.allowFullscreen = true;
          this.container.appendChild(iframe);
        }
      }
      normalizeUrl(url) {
        const vkShortRegex = /^https:\/\/vkvideo\.ru\/video(\d+)_(\d+)$/;
        const vkMatch = url.match(vkShortRegex);
        if (vkMatch) {
          const oid = vkMatch[1];
          const id = vkMatch[2];
          return `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}&hd=2`;
        }
        const rutubeRegex = /^https:\/\/rutube\.ru\/video\/([a-z0-9]+)\/?$/i;
        const rutubeMatch = url.match(rutubeRegex);
        if (rutubeMatch) {
          const id = rutubeMatch[1];
          return `https://rutube.ru/play/embed/${id}`;
        }
        return url;
      }
    };
    __name(_LazyVideo, "LazyVideo");
    let LazyVideo = _LazyVideo;
    const videos = document.querySelectorAll(".video");
    if (videos) {
      videos.forEach((video2) => {
        const videoUrl = video2.dataset.url;
        const isFile = (() => {
          try {
            const url = new URL(videoUrl, window.location.origin);
            return url.origin === window.location.origin;
          } catch {
            return true;
          }
        })();
        new LazyVideo(videoUrl, {
          container: video2,
          isFile
        });
      });
    }
  }
  __name(video, "video");

  // src/assets/js/scripts/ui/scroll.js
  function scrolling() {
    let dataScrollingBlocks = document.querySelectorAll("[data-scrolling]");
    if (dataScrollingBlocks) {
      dataScrollingBlocks.forEach((element) => {
        let isDragging = false;
        let startX;
        let scrollLeft;
        let moved = false;
        element.addEventListener("mousedown", (e) => {
          isDragging = true;
          moved = false;
          element.classList.add("dragging");
          startX = e.pageX - element.offsetLeft;
          scrollLeft = element.scrollLeft;
          element.querySelectorAll("img, a").forEach((item) => item.ondragstart = () => false);
        });
        element.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          e.preventDefault();
          moved = true;
          const x = e.pageX - element.offsetLeft;
          const walk = x - startX;
          element.scrollLeft = scrollLeft - walk;
        });
        element.addEventListener("mouseup", (e) => {
          isDragging = false;
          element.classList.remove("dragging");
          element.querySelectorAll("img, a").forEach((item) => item.ondragstart = null);
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
        element.addEventListener("mouseleave", () => {
          isDragging = false;
          element.classList.remove("dragging");
          element.querySelectorAll("img, a").forEach((item) => item.ondragstart = null);
        });
        element.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", (e) => {
            if (moved) {
              e.preventDefault();
              e.stopPropagation();
            }
          });
        });
      });
    }
  }
  __name(scrolling, "scrolling");

  function scrollToSmoothly(pos, time = 400) {
    const currentPos = window.pageYOffset;
    let start = null;
    window.requestAnimationFrame( /* @__PURE__ */ __name(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, (pos - currentPos) * progress / time + currentPos);
      } else {
        window.scrollTo(0, currentPos - (currentPos - pos) * progress / time);
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    }, "step"));
  }
  __name(scrollToSmoothly, "scrollToSmoothly");
  var _ZoomDetector = class _ZoomDetector {
    constructor() {
      this.lastZoom = this.getCurrentZoom();
      this.isChecking = false;
      this.startDetection();
    }
    getCurrentZoom() {
      return window.outerWidth / window.innerWidth;
    }
    startDetection() {
      const checkZoom = /* @__PURE__ */ __name(() => {
        const currentZoom = this.getCurrentZoom();
        if (Math.abs(currentZoom - this.lastZoom) > 0.01) {
          this.lastZoom = currentZoom;
          this.onZoomChange(currentZoom);
        }
        if (this.isChecking) {
          requestAnimationFrame(checkZoom);
        }
      }, "checkZoom");
      this.isChecking = true;
      checkZoom();
    }
    stopDetection() {
      this.isChecking = false;
    }
    onZoomChange(zoomLevel) {
      const percentage = Math.round(zoomLevel * 100);
      window.dispatchEvent(
        new CustomEvent("zoomchange", {
          detail: {
            zoomLevel: percentage
          }
        })
      );
    }
  };
  __name(_ZoomDetector, "ZoomDetector");
  var ZoomDetector = _ZoomDetector;
  var zoomDetector = new ZoomDetector();
  window.addEventListener("zoomchange", (e) => {
    if (haveScroll()) {
      changeScrollbarGutter(false);
    }
  });

  // src/assets/js/scripts/ui/url.js
  function getHash() {
    return location.hash ? location.hash.replace("#", "") : "";
  }
  __name(getHash, "getHash");

  function removeHash() {
    setTimeout(() => {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }, 100);
  }
  __name(removeHash, "removeHash");

  function setHash(hash) {
    hash = hash ? `#${hash}` : window.location.href.split("#")[0];
    history.pushState("", "", hash);
  }
  __name(setHash, "setHash");

  function getParameters() {
    const params = new URLSearchParams(window.location.search);
    const map2 = /* @__PURE__ */ new Map();
    params.forEach((value, key) => {
      map2.set(key, value);
    });
    return map2;
  }
  __name(getParameters, "getParameters");

  // src/assets/js/components/scroll.js
  function scroll() {
    let headerScroll = 0;
    const scrollLinks = document.querySelectorAll("[data-scroll], .menu a");
    if (scrollLinks.length) {
      scrollLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const target = link.hash;
          if (target && target !== "#") {
            const scrollBlock = document.querySelector(target);
            e.preventDefault();
            if (scrollBlock) {
              headerScroll = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;
              scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll), 400);
              removeHash();
              menu.classList.remove(menuActive);
              menuLink.classList.remove("active");
              body.classList.remove("no-scroll");
            } else {
              let [baseUrl, hash] = link.href.split("#");
              if (window.location.href !== baseUrl && hash) {
                link.setAttribute("href", `${baseUrl}?link=${hash}`);
                window.location = link.getAttribute("href");
              }
            }
          }
        });
      });
    }
    document.addEventListener("DOMContentLoaded", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const link = urlParams.get("link");
      if (link) {
        if (link.startsWith("tab-") && /^\d+-\d+$/.test(link.replace("tab-", ""))) {
          const [_, blockIndex, tabIndex] = link.split("-");
          const tabsBlock = document.querySelector(`[data-tabs-index="${blockIndex}"]`);
          const tabs = tabsBlock.querySelectorAll("[data-tabs-title]");
          if (tabs && tabs[tabIndex]) {
            tabs[tabIndex].click();
            scrollToSmoothly(offset(tabsBlock).top - parseInt(headerTop.clientHeight), 400);
          }
        } else if (link.startsWith("tab-")) {
          const tabId = link;
          const tabButton = document.getElementById(tabId);
          if (tabButton) {
            tabButton.click();
            scrollToSmoothly(offset(tabButton.closest("[data-tabs]") || tabButton).top - parseInt(headerTop.clientHeight), 400);
          }
        } else {
          const scrollBlock = document.getElementById(link);
          if (scrollBlock) {
            const headerScroll2 = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;
            scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll2), 400);
          }
        }
        urlParams.delete("link");
        const newUrl = urlParams.toString() ? `${window.location.pathname}?${urlParams}` : window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    });
  }
  __name(scroll, "scroll");

  // src/assets/js/components/range.js
  function range() {
    let ranges = document.querySelectorAll(".range");
    if (ranges) {
      ranges.forEach((rangeBlock) => {
        const rangeMin = rangeBlock.querySelector('input[type=range][data-role="min"]');
        const rangeMax = rangeBlock.querySelector('input[type=range][data-role="max"]');
        const inputMin = rangeBlock.querySelector('input[type=number][data-role="min"]');
        const inputMax = rangeBlock.querySelector('input[type=number][data-role="max"]');
        const rangeBetween = rangeBlock.querySelector(".range__between");
        const track = rangeBlock.querySelector(".range__track");
        const minValue = parseInt(rangeMin.min);
        const maxValue = parseInt(rangeMax.max);
        let isTouched = false;

        function activateBetween() {
          if (!isTouched) {
            rangeBetween.style.display = "block";
            isTouched = true;
          } else {
            if (!rangeBlock.classList.contains("active")) {
              rangeBlock.classList.add("active");
            }
          }
        }
        __name(activateBetween, "activateBetween");

        function updateBetween(min, max) {
          const range2 = maxValue - minValue;
          const left = (min - minValue) / range2 * 100;
          const right = 100 - (max - minValue) / range2 * 100;
          rangeBetween.style.left = `${left}%`;
          rangeBetween.style.right = `${right}%`;
        }
        __name(updateBetween, "updateBetween");

        function syncFromRange() {
          activateBetween();
          let min = parseInt(rangeMin.value);
          let max = parseInt(rangeMax.value);
          if (min > max)[min, max] = [max, min];
          inputMin.value = min;
          inputMax.value = max;
          updateBetween(min, max);
        }
        __name(syncFromRange, "syncFromRange");

        function syncFromInput() {
          activateBetween();
          let min = parseInt(inputMin.value);
          let max = parseInt(inputMax.value);
          min = Math.max(minValue, Math.min(min, maxValue));
          max = Math.max(minValue, Math.min(max, maxValue));
          if (min > max)[min, max] = [max, min];
          inputMin.value = min;
          inputMax.value = max;
          rangeMin.value = min;
          rangeMax.value = max;
          updateBetween(min, max);
        }
        __name(syncFromInput, "syncFromInput");
        track.addEventListener("click", (e) => {
          if (!(e.target.classList.contains("range__track") || e.target.classList.contains("range__between"))) {
            return;
          }
          const rect = track.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickRatio = clickX / rect.width;
          const clickedValue = Math.round(minValue + clickRatio * (maxValue - minValue));
          const distToMin = Math.abs(clickedValue - parseInt(rangeMin.value));
          const distToMax = Math.abs(clickedValue - parseInt(rangeMax.value));
          if (distToMin <= distToMax) {
            rangeMin.value = clickedValue;
          } else {
            rangeMax.value = clickedValue;
          }
          syncFromRange();
        });
        rangeMin.addEventListener("input", syncFromRange);
        rangeMax.addEventListener("input", syncFromRange);
        inputMin.addEventListener("change", syncFromInput);
        inputMax.addEventListener("change", syncFromInput);
        rangeBlock.closest("form").querySelector('[type="reset"]').addEventListener("click", function() {
          rangeBetween.style.left = "0";
          rangeBetween.style.right = "0";
        });
        syncFromRange();
      });
    }
  }
  __name(range, "range");

  // src/assets/js/components/select.js
  function select() {
    let allSelects = document.querySelectorAll("select");
    let slimSelectInstances = [];
    if (allSelects.length) {
      allSelects.forEach((select2) => {
        let instance = new SlimSelect({
          select: select2,
          settings: {
            placeholderText: select2.getAttribute("data-placeholder") || null,
            // openPosition: 'auto',
            // openPositionX: 'left',
            showSearch: select2.hasAttribute("data-search"),
            searchText: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
            searchPlaceholder: "\u041F\u043E\u0438\u0441\u043A",
            searchHighlight: true,
            allowDeselect: true,
            maxValuesShown: select2.hasAttribute("data-count") ? 1 : false,
            maxValuesMessage: "\u0412\u044B\u0431\u0440\u0430\u043D\u043E ({number})",
            closeOnSelect: select2.hasAttribute("data-not-close") ? false : true
            // hideSelected: true,
          },
          events: {
            beforeOpen: /* @__PURE__ */ __name(() => {
              closeAllSelects(instance);
            }, "beforeOpen"),
            afterOpen: /* @__PURE__ */ __name(() => {
              currentOpenSelect = instance;
              if (select2.hasAttribute("data-search")) {
                requestAnimationFrame(() => {
                  const searchInput = document.querySelector(`.select__content[data-id="${select2.getAttribute("data-id")}"] .select__input input`);
                  if (searchInput) {
                    searchInput.focus();
                  }
                });
              }
            }, "afterOpen"),
            afterClose: /* @__PURE__ */ __name(() => {
              if (currentOpenSelect === instance) {
                currentOpenSelect = null;
              }
            }, "afterClose")
          }
        });
        if (select2.hasAttribute("data-open")) {
          requestAnimationFrame(() => {
            instance.open();
          });
        }
        slimSelectInstances.push({
          instance,
          select: select2
        });
        const selectAttribures = Array.from(select2.attributes).filter((attr) => ![
          "class",
          "tabindex",
          "multiple",
          "data-id",
          "aria-hidden",
          "style"
        ].includes(attr.name)).map((attr) => `${attr.name}="${attr.value}"`);
        selectAttribures.forEach((attr) => {
          const [name, value] = attr.split("=");
          const selectOptions = document.querySelector(`.select__content[data-id="${select2.getAttribute("data-id")}"] .select__options`);
          if (selectOptions) {
            selectOptions.setAttribute(name, value.replace(/"/g, ""));
            if (name === "data-scroll") {
              selectOptions.style.maxHeight = value.replace(/["']/g, "");
            }
          }
        });
        select2.addEventListener("change", function() {
          const selectedOption = this.options[this.selectedIndex];
          const href = selectedOption.getAttribute("data-href");
          if (href && href !== "#") {
            window.location.href = href;
          }
        });
      });
      let currentOpenSelect = null;
      window.addEventListener("scroll", () => {
        closeAllSelects();
      });
      document.addEventListener("mousedown", (e) => {
        const clickedSelect = e.target.closest(".select__content") || e.target.closest(".select");
        if (!clickedSelect) {
          closeAllSelects();
        }
      });
      document.querySelectorAll("form").forEach((form2) => {
        form2.addEventListener("reset", () => {
          requestAnimationFrame(() => {
            slimSelectInstances.forEach(({
              instance,
              select: select2
            }) => {
              if (form2.contains(select2)) {
                if (select2.multiple) {
                  const selectedValues = Array.from(select2.selectedOptions).map((opt) => opt.value);
                  instance.setSelected(selectedValues);
                } else {
                  instance.setSelected(select2.value || "");
                }
              }
            });
          });
        });
      });
      const closeAllSelects = /* @__PURE__ */ __name((currentInstance = null) => {
        slimSelectInstances.forEach(({
          instance
        }) => {
          if (instance !== currentInstance) instance.close();
        });
      }, "closeAllSelects");
    }
  }
  __name(select, "select");

  // src/assets/js/components/text.js
  function text() {
    let dataText = document.querySelectorAll("[data-text]");
    dataText.forEach((dataTextItem) => {
      dataTextItem.addEventListener("click", function() {
        let text2 = this.getAttribute("data-text").replace(/\s{2,}/g, " ").split(";");
        text2.forEach((element) => {
          let items = element.split("|");
          items.forEach((item) => {
            let parent = item.split(",")[0].trim();
            let children = item.split(",")[1].trim();
            let where = item.split(",")[2].trim();
            let issetParent = this.closest(parent)?.length != 0;
            let isClassMatch = (() => {
              const cleanSelector = children.replace(/\[\d+\]$/, "");
              return cleanSelector.startsWith(".") && this.classList.contains(cleanSelector.substring(1));
            })();
            let isNotInput = document.querySelector(where).tagName != "INPUT";
            let searchInChildren;
            let target = this.closest(parent)?.querySelector(children);
            searchInChildren = target ? target[isNotInput ? "innerHTML" : "value"] : false;
            let searchInThis = (() => {
              const match = children.match(/(.*?)(?:\[(\d+)\])?$/);
              const elements = document.querySelectorAll(match[1]);
              return elements[match[2] ? parseInt(match[2]) : 0]?.innerHTML;
            })();
            if (parent == children) {
              document.querySelector(where).innerHTML = `${this.closest(parent).outerHTML}`;
            }
            if (document.querySelector(where).tagName == "IMG" && document.querySelector(children).tagName == "IMG") {
              document.querySelector(where).style.opacity = "0";
              document.querySelector(where).src = document.querySelector(children).getAttribute("src");
              setTimeout(() => {
                document.querySelector(where).style.opacity = "1";
              }, 300);
            } else {
              if (issetParent && isNotInput && isClassMatch && searchInThis || !issetParent && isNotInput && isClassMatch && searchInThis) {
                document.querySelector(where).innerHTML = searchInThis;
              }
              if (issetParent && isNotInput && !isClassMatch && searchInChildren || !issetParent && isNotInput && !isClassMatch && searchInChildren) {
                document.querySelector(where).innerHTML = searchInChildren;
              }
              if (issetParent && !isNotInput && isClassMatch && searchInThis || !issetParent && !isNotInput && isClassMatch && searchInThis) {
                document.querySelector(where).value = searchInThis;
              }
              if (issetParent && !isNotInput && !isClassMatch && searchInChildren || !issetParent && !isNotInput && !isClassMatch && searchInChildren) {
                document.querySelector(where).value = searchInChildren;
              }
              if (where.charAt(0) == "a") {
                document.querySelector(where).setAttribute("href", document.querySelector(children).getAttribute("href"));
              }
            }
          });
        });
      });
    });
  }
  __name(text, "text");
  text();

  // src/assets/js/components/popup.js
  function popup2() {
    const modalButtons = document.querySelectorAll("[data-modal]");
    const popupDialogs = document.querySelectorAll(".popup__dialog");
    document.querySelectorAll("[data-modal]").forEach((button) => {
      button.addEventListener("click", function() {
        let [dataModal, dataTab] = button.getAttribute("data-modal").split("#");
        let popup3 = document.getElementById(dataModal);
        if (!popup3) return;
        if (getHash() && !button.hasAttribute("data-modal-not-hash")) {
          history.pushState("", document.title, (window.location.pathname + window.location.search).replace(getHash(), ""));
        }
        hideScrollbar();
        body.classList.add(bodyOpenModalClass2);
        if (!window.location.hash.includes(dataModal) && !button.hasAttribute("data-modal-not-hash")) {
          window.location.hash = dataModal;
        }
        fadeIn(popup3, true);
        popup3.classList.remove("popup_close");
        popup3.classList.add("popup_open");
        if (dataTab) {
          document.querySelector(`[data-href="#${dataTab}"]`)?.click();
        }
      });
    });
    window.addEventListener("load", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const popup3 = document.querySelector(`.popup[id="${hash}"]`);
        if (popup3) {
          setTimeout(() => {
            hideScrollbar();
            popup3.classList.add("popup_open");
            fadeIn(popup3, true);
          }, 500);
        }
      }
    });

    function closeModal(popup3, removeHashFlag = true) {
      if (!popup3) return;
      popup3.classList.remove("popup_open");
      popup3.classList.add("popup_close");
      setTimeout(() => {
        fadeOut(popup3, true);
        modalButtons.forEach((button) => button.disabled = true);
        body.classList.remove(bodyOpenModalClass2);
        setTimeout(() => {
          let modalInfo = document.querySelector(".popup-info");
          if (modalInfo) modalInfo.value = "";
          showScrollbar();
          modalButtons.forEach((button) => button.disabled = false);
        }, 400);
        if (removeHashFlag && getHash() == popup3.id) {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        clearInputs();
      }, 200);
    }
    __name(closeModal, "closeModal");
    document.querySelectorAll("[data-popup-close]").forEach((element) => {
      element.addEventListener("click", () => closeModal(element.closest(".popup")));
    });
    window.addEventListener("click", (e) => {
      popupDialogs.forEach((popup3) => {
        if (e.target === popup3) {
          closeModal(popup3.closest(".popup"));
        }
      });
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.querySelectorAll(".lg-show").length === 0) {
        closeModal(document.querySelector(".popup_open"));
      }
    });
    let isAnimating = false;
    window.addEventListener("popstate", async () => {
      if (isAnimating) {
        await new Promise((resolve) => {
          const checkAnimation = /* @__PURE__ */ __name(() => {
            if (!document.body.classList.contains("_fade")) {
              resolve();
            } else {
              setTimeout(checkAnimation, 50);
            }
          }, "checkAnimation");
          checkAnimation();
        });
      }
      const hash = window.location.hash.replace("#", "");
      const popup3 = hash ? document.querySelector(`.popup[id="${hash}"]`) : null;
      const openedPopup = document.querySelector(".popup_open");
      if (hash && popup3) {
        hideScrollbar();
        isAnimating = true;
        await fadeIn(popup3, true);
        popup3.classList.remove("popup_close");
        popup3.classList.add("popup_open");
        isAnimating = false;
      } else if (!hash && openedPopup) {
        isAnimating = true;
        await closeModal(openedPopup, false);
        isAnimating = false;
      }
    });
  }
  __name(popup2, "popup");

  // src/assets/js/components/spoller.js
  function spoller() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (!spollersArray.length) return;
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = [...spollersArray].filter((item) => !item.dataset.spollers.split(",")[0]);
    if (spollersRegular.length) initSpollers(spollersRegular);
    const mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    mdQueriesArray?.forEach((mdItem) => {
      mdItem.matchMedia.addEventListener("change", () => initSpollers(mdItem.itemsArray, mdItem.matchMedia));
      initSpollers(mdItem.itemsArray, mdItem.matchMedia);
    });

    function initSpollers(array, matchMedia = false) {
      array.forEach((spollersBlock) => {
        const block = matchMedia ? spollersBlock.item : spollersBlock;
        const isInit = matchMedia ? matchMedia.matches : true;
        block.classList.toggle("_spoller-init", isInit);
        initSpollerBody(block, isInit);
      });
    }
    __name(initSpollers, "initSpollers");

    function initSpollerBody(block, hideBody = true) {
      block.querySelectorAll("[data-spoller]").forEach((item) => {
        const title = item.querySelector("[data-spoller-title]");
        const content = item.querySelector("[data-spoller-content]");
        if (!content) return;
        if (hideBody) {
          if (!item.hasAttribute("data-open")) {
            content.style.display = "none";
            title.classList.remove("active");
          } else {
            title.classList.add("active");
          }
        } else {
          content.style.display = "";
          title.classList.remove("active");
        }
      });
    }
    __name(initSpollerBody, "initSpollerBody");

    function setSpollerAction(e) {
      const titleEl = e.target.closest("[data-spoller-title]");
      const blockEl = e.target.closest("[data-spollers]");
      if (titleEl && blockEl) {
        if (blockEl.classList.contains("_disabled-click")) return;
        const itemEl = titleEl.closest("[data-spoller]");
        const contentEl = itemEl.querySelector("[data-spoller-content]");
        const speed = parseInt(blockEl.dataset.spollersSpeed) || 400;
        blockEl.classList.add("_disabled-click");
        setTimeout(() => blockEl.classList.remove("_disabled-click"), speed);
        if (blockEl.classList.contains("_spoller-init") && contentEl && !blockEl.querySelectorAll("._slide").length) {
          if (blockEl.hasAttribute("data-one-spoller") && !titleEl.classList.contains("active")) {
            hideSpollersBody(blockEl);
          }
          titleEl.classList.toggle("active");
          _slideToggle(contentEl, speed);
          if (itemEl.hasAttribute("data-spoller-scroll") && titleEl.classList.contains("active")) {
            const scrollOffset = parseInt(itemEl.dataset.spollerScroll) || 0;
            const headerOffset = itemEl.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header")?.offsetHeight || 0 : 0;
            window.scrollTo({
              top: itemEl.offsetTop - (scrollOffset + headerOffset),
              behavior: "smooth"
            });
          }
        }
      }
      if (!blockEl) {
        document.querySelectorAll("[data-spoller-close]").forEach((title) => {
          const item = title.closest("[data-spoller]");
          const block = title.closest("[data-spollers]");
          const content = item.querySelector("[data-spoller-content]");
          const speed = parseInt(block.dataset.spollersSpeed) || 400;
          if (block.classList.contains("_spoller-init")) {
            title.classList.remove("active");
            _slideUp2(content, speed);
          }
        });
      }
    }
    __name(setSpollerAction, "setSpollerAction");

    function hideSpollersBody(block) {
      const activeTitle = block.querySelector("[data-spoller] .active");
      if (!activeTitle || block.querySelectorAll("._slide").length) return;
      const content = activeTitle.closest("[data-spoller]")?.querySelector("[data-spoller-content]");
      const speed = parseInt(block.dataset.spollersSpeed) || 400;
      activeTitle.classList.remove("active");
      _slideUp2(content, speed);
    }
    __name(hideSpollersBody, "hideSpollersBody");
  }
  __name(spoller, "spoller");

  // src/assets/js/components/tab.js
  function tab() {
    let tabs = document.querySelectorAll("[data-tabs]");
    let tabsActiveHash = [];
    let tabsHashId = null;
    if (tabs.length > 0) {
      let hash = getHash();
      if (hash && hash.startsWith("tab-")) {
        const hashValue = hash.replace("tab-", "");
        if (/^\d+-\d+$/.test(hashValue)) {
          tabsActiveHash = hashValue.split("-");
        } else {
          tabsHashId = hashValue;
        }
      }
      tabs.forEach((tabsBlock, index) => {
        tabsBlock.classList.add("tab_init");
        tabsBlock.setAttribute("data-tabs-index", index);
        tabsBlock.addEventListener("click", setTabsAction);
        initTabs(tabsBlock);
      });
      let mdQueriesArray = dataMediaQueries(tabs, "tabs");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach((mdQueriesItem) => {
          mdQueriesItem.matchMedia.addEventListener("change", function() {
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      }
    }

    function setTitlePosition(tabsMediaArray, matchMedia) {
      tabsMediaArray.forEach((tabsMediaItem) => {
        tabsMediaItem = tabsMediaItem.item;
        let tabsTitles = tabsMediaItem.querySelector("[data-tabs-header]");
        let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
        let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
        let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
        tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-tabs]") === tabsMediaItem);
        tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-tabs]") === tabsMediaItem);
        tabsContentItems.forEach((tabsContentItem, index) => {
          if (matchMedia.matches) {
            tabsContent.append(tabsTitleItems[index]);
            tabsContent.append(tabsContentItem);
            tabsMediaItem.classList.add("tab-spoller");
          } else {
            tabsTitles.append(tabsTitleItems[index]);
            tabsMediaItem.classList.remove("tab-spoller");
          }
        });
      });
    }
    __name(setTitlePosition, "setTitlePosition");

    function initTabs(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-header]>*");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
      let tabsBlockIndex = tabsBlock.dataset.tabsIndex;
      let tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
      if (tabsContent.length) {
        tabsContent.forEach((tabsContentItem, index) => {
          tabsTitles[index].setAttribute("data-tabs-title", "");
          tabsContentItem.setAttribute("data-tabs-item", "");
          if (tabsHashId || tabsActiveHashBlock) {
            tabsTitles[index].classList.remove("active");
          }
          if (tabsHashId) {
            if (tabsTitles[index].dataset.tabId === tabsHashId) {
              tabsTitles[index].classList.add("active");
            }
          } else if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
            tabsTitles[index].classList.add("active");
          }
          tabsContentItem.hidden = true;
        });
        let activeTab = tabsBlock.querySelector("[data-tabs-header]>.active");
        if (!activeTab) {
          tabsTitles[0].classList.add("active");
          tabsContent[0].hidden = false;
        } else {
          tabsContent[indexInParent(activeTab)].hidden = false;
        }
      }
    }
    __name(initTabs, "initTabs");

    function setTabsStatus(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
      let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
      let tabsBlockIndex = tabsBlock.dataset.tabsIndex;

      function isTabsAnamate(tabsBlock2) {
        if (tabsBlock2.hasAttribute("data-tabs-animate")) {
          return tabsBlock2.dataset.tabsAnimate > 0 ? Number(tabsBlock2.dataset.tabsAnimate) : 500;
        }
      }
      __name(isTabsAnamate, "isTabsAnamate");
      let tabsBlockAnimate = isTabsAnamate(tabsBlock);
      if (tabsContent.length > 0) {
        let isHash = tabsBlock.hasAttribute("data-tabs-hash");
        tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-tabs]") === tabsBlock);
        tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-tabs]") === tabsBlock);
        tabsContent.forEach((tabsContentItem, index) => {
          if (tabsTitles[index].classList.contains("active")) {
            if (tabsBlockAnimate) {
              _slideDown(tabsContentItem, tabsBlockAnimate);
            } else {
              fadeIn(tabsContentItem, true);
              tabsContentItem.hidden = false;
            }
            if (isHash && !tabsContentItem.closest(".popup")) {
              const activeTitle = tabsTitles[index];
              const tabId = activeTitle.dataset.tabId;
              if (tabId) {
                setHash(`tab-${tabId}`);
              } else {
                setHash(`tab-${tabsBlockIndex}-${index}`);
              }
            }
          } else {
            if (tabsBlockAnimate) {
              _slideUp(tabsContentItem, tabsBlockAnimate);
            } else {
              tabsContentItem.style.display = "none";
              tabsContentItem.hidden = true;
            }
          }
        });
      }
    }
    __name(setTabsStatus, "setTabsStatus");

    function setTabsAction(e) {
      let el = e.target;
      if (el.closest("[data-tabs-title]") && !el.closest("[data-tabs-title]").classList.contains("active")) {
        let tabTitle = el.closest("[data-tabs-title]");
        let tabsBlock = tabTitle.closest("[data-tabs]");
        if (!tabTitle.classList.contains("active") && !tabsBlock.querySelector("._slide")) {
          let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title].active");
          tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-tabs]") === tabsBlock) : null;
          tabActiveTitle.length ? tabActiveTitle[0].classList.remove("active") : null;
          tabTitle.classList.add("active");
          setTabsStatus(tabsBlock);
          scrollToSmoothly(offset(el.closest("[data-tabs]")).top - parseInt(headerTop.clientHeight));
        }
        e.preventDefault();
      }
    }
    __name(setTabsAction, "setTabsAction");
    let dataTabs = document.querySelectorAll("[data-tab]");
    dataTabs.forEach((button) => {
      button.addEventListener("click", function() {
        document.querySelector(button.getAttribute("data-tab")).click();
        scrollToSmoothly(offset(document.querySelector(button.getAttribute("data-tab"))).top - parseInt(headerTop.clientHeight));
      });
    });
  }
  __name(tab, "tab");

  // src/assets/js/components/subMenu.js
  function subMenu() {
    subMenuInit();
    let mediaSwitcher = false;
    let isResize;

    function subMenuResize() {
      if (isDesktop()) {
        subMenuInit(isResize = true);
        if (!mediaSwitcher) {
          document.querySelectorAll(".menu-item-has-children").forEach((item) => {
            item.classList.remove("active", "left", "right", "top", "menu-item-has-children_not-relative");
            const submenu = item.querySelector(".sub-menu-wrapper");
            if (submenu) {
              submenu.removeAttribute("style");
              submenu.classList.remove("active");
            }
            const arrow = item.querySelector(".menu-item-arrow");
            if (arrow) {
              arrow.classList.remove("active");
            }
          });
          subMenuInit(true);
          mediaSwitcher = true;
        }
      } else {
        let menuItemHasChildren = document.querySelectorAll(".menu-item-has-children");
        menuItemHasChildren.forEach((item) => {
          item.querySelector(".sub-menu-wrapper").style.display = "block";
          toggleSubMenuVisible(item);
        });
        mediaSwitcher = false;
      }
    }
    __name(subMenuResize, "subMenuResize");
    window.addEventListener("resize", debounce(subMenuResize, 100));

    function subMenuInit(isResize2 = false) {
      let menuItemHasChildren = document.querySelectorAll(".menu-item-has-children");
      menuItemHasChildren.forEach((item) => {
        let timeoutId = null;
        item.onmouseover = null;
        item.onmouseout = null;
        item.onfocusin = null;
        item.onfocusout = null;
        item.addEventListener("mouseover", function(e) {
          if (!isDesktop()) return;
          clearTimeout(timeoutId);
          menuMouseOverInit(item, e, isResize2);
        });
        item.addEventListener("focusin", function(e) {
          if (!isDesktop()) return;
          clearTimeout(timeoutId);
          menuMouseOverInit(item, e, isResize2);
        });
        item.addEventListener("mouseout", function(e) {
          if (!isDesktop()) return;
          clearTimeout(timeoutId);
          const menu2 = item.closest(".menu");
          if (item.classList.contains("top")) {
            timeoutId = setTimeout(() => {
              if (!menu2.contains(document.querySelector(":hover"))) {
                item.classList.remove("active");
              }
            }, 300);
          } else {
            if (menu2.contains(e.relatedTarget)) {
              item.classList.remove("active");
            } else {
              timeoutId = setTimeout(() => {
                if (!menu2.contains(document.querySelector(":hover"))) {
                  item.classList.remove("active");
                }
              }, 300);
            }
          }
        });
        item.addEventListener("focusout", function(e) {
          if (!isDesktop()) return;
          timeoutId = setTimeout(() => {
            if (!item.contains(document.activeElement)) {
              item.classList.remove("active");
            }
          }, 500);
        });
        toggleSubMenuVisible(item, !isDesktop());
      });
    }
    __name(subMenuInit, "subMenuInit");

    function menuMouseOverInit(item, e, isResize2) {
      document.querySelectorAll(".menu>.menu-item-has-children").forEach((li) => {
        if (li != item) {
          li.classList.remove("active");
        }
      });
      if (isDesktop()) {
        if (!isResize2) {
          item.classList.add("active");
        }
        if (item.closest(".menu")) {
          if (getPageSideMenu(e) == "left") {
            item.classList.add("left");
          } else {
            item.classList.add("right");
          }
        }
        if (item == getTargetElementTag(e)) {
          if (getPageSideMenu(e) == "left" && offset(item).right < item.offsetWidth || getPageSideMenu(e) == "right" && offset(item).left < item.offsetWidth) {
            item.classList.add("top", "menu-item-has-children_not-relative");
          }
        }
        const submenu = item.querySelector(".sub-menu-wrapper");
        if (submenu) {
          const cssMaxWidth = window.innerWidth * 0.5;
          const side = getPageSideMenu(e);
          const rect = submenu.getBoundingClientRect();
          const availableSpace = side === "left" ? window.innerWidth - rect.left - 20 : rect.right - 20;
          if (side == "left") {
            if (offset(submenu).right < 0) {
              const newMax = Math.min(availableSpace, cssMaxWidth);
              submenu.style.maxWidth = `${newMax - 12}px`;
            }
          } else {
            if (offset(submenu).left < 0) {
              const newMax = Math.min(availableSpace, cssMaxWidth);
              submenu.style.maxWidth = `${newMax - 12}px`;
            }
          }
        }
      }
    }
    __name(menuMouseOverInit, "menuMouseOverInit");
    let menuItemArrow = document.querySelectorAll(".menu-item-arrow");
    let isClicked = false;
    menuItemArrow.forEach((item) => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        if (!isDesktop()) {
          if (!isClicked) {
            isClicked = true;
            if (!item.classList.contains("active")) {
              item.classList.add("active");
              item.parentElement.nextElementSibling.classList.add("active");
              _slideDown2(item.parentElement.nextElementSibling, 200);
            } else {
              item.classList.remove("active");
              item.parentElement.nextElementSibling.classList.remove("remove");
              _slideUp2(item.parentElement.nextElementSibling, 200);
            }
            setTimeout(() => {
              isClicked = false;
            }, 300);
          }
        }
      });
    });
    document.querySelectorAll(".menu-item-has-children > a").forEach((link) => {
      link.addEventListener("click", function(e) {
        let textNode = link.childNodes[0];
        let textRange = document.createRange();
        textRange.selectNodeContents(textNode);
        let textRect = textRange.getBoundingClientRect();
        if (e.clientX >= textRect.left && e.clientX <= textRect.right && e.clientY >= textRect.top && e.clientY <= textRect.bottom) {
          return;
        }
        e.preventDefault();
        let arrow = link.querySelector(".menu-item-arrow");
        if (arrow) arrow.click();
      });
    });

    function toggleSubMenuVisible(item, state = true) {
      let subMenu2 = item.querySelectorAll(".sub-menu-wrapper");
      subMenu2.forEach((element) => {
        element.style.display = state ? "none" : "block";
      });
    }
    __name(toggleSubMenuVisible, "toggleSubMenuVisible");

    function getTargetElementTag(e) {
      return e.target.parentElement.tagName == "LI" ? e.target.parentElement : e.target;
    }
    __name(getTargetElementTag, "getTargetElementTag");

    function getPageSideMenu(e) {
      return e.target.closest(".menu") ? offset(e.target.closest(".menu>.menu-item-has-children")).left > windowWidth / 2 ? "right" : "left" : "left";
    }
    __name(getPageSideMenu, "getPageSideMenu");
  }
  __name(subMenu, "subMenu");

  // src/assets/js/components/showMore.js
  function showMore() {
    document.querySelectorAll("[data-more-wrapper]").forEach((wrapper) => {
      const button = wrapper.querySelector("[data-more]");
      if (!button) return;
      const [initialCount, stepCount, selector = "[data-more-item]"] = button.getAttribute("data-more").split(",");
      const items = Array.from(wrapper.querySelectorAll(selector));
      const moreOpenText = button.querySelector("[data-more-open]");
      const moreCloseText = button.querySelector("[data-more-close]");
      const [mediaBreakpointRaw, mediaBreakpointType = "max"] = wrapper.dataset.media ? wrapper.dataset.media.split(",") : [];
      const mediaBreakpoint = mediaBreakpointRaw ? parseInt(mediaBreakpointRaw) : null;
      let visibleCount = parseInt(initialCount);
      let mediaQuery = null;
      const isLinesMode = stepCount === "lines";
      let isToggleActive = false;
      let linesTarget = wrapper.querySelector("[data-lines]");
      let linesSpeed = 400;
      let hiddenElements = [];
      if (!linesTarget.dataset.original) {
        linesTarget.dataset.original = linesTarget.innerHTML;
      }
      const applyTransition = /* @__PURE__ */ __name((element) => {
        element.style.transition = "max-height 0.3s ease";
        element.style.overflow = "hidden";
      }, "applyTransition");

      function animateHeight(element, targetHeight, duration = linesSpeed) {
        const startHeight = element.offsetHeight;
        const heightDiff = targetHeight - startHeight;
        const startTime = performance.now();
        element.style.overflow = "hidden";

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          element.style.height = startHeight + heightDiff * easeProgress + "px";
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            element.style.height = targetHeight + "px";
          }
        }
        __name(step, "step");
        requestAnimationFrame(step);
      }
      __name(animateHeight, "animateHeight");
      const toggleLinesMode = /* @__PURE__ */ __name(() => {
        if (!linesTarget) return;
        const isExpanded = linesTarget.classList.toggle("active");
        if (isExpanded) {
          hiddenElements.forEach((span) => {
            span.classList.add("show");
            setTimeout(() => {
              span.classList.remove("hidd", "show");
              const children = Array.from(span.childNodes);
              span.replaceWith(...children);
            }, linesSpeed);
          });
          hiddenElements = [];
        } else {
          animateHeight(linesTarget, linesTarget.getAttribute("data-default-height"), linesSpeed);
          setTimeout(() => {
            hiddenElements = limitLines(linesTarget, initialCount);
          }, linesSpeed);
          setTimeout(() => {
            linesTarget.removeAttribute("style");
          }, linesSpeed + 50);
        }
        if (moreOpenText) moreOpenText.style.display = isExpanded ? "none" : "";
        if (moreCloseText) moreCloseText.style.display = isExpanded ? "" : "none";
        if (isExpanded) {
          wrapper.classList.add("active");
          button.classList.add("active");
        } else {
          wrapper.classList.remove("active");
          button.classList.remove("active");
        }
      }, "toggleLinesMode");
      const resetInitialState = /* @__PURE__ */ __name(() => {
        visibleCount = parseInt(initialCount);
        if (isLinesMode && linesTarget) {
          hiddenElements.forEach((span) => {
            const children = Array.from(span.childNodes);
            span.replaceWith(...children);
          });
          hiddenElements = limitLines(linesTarget, initialCount);
          linesTarget.classList.remove("active");
          wrapper.classList.remove("active");
          button.classList.remove("active");
        } else {
          items.forEach((item, index) => {
            applyTransition(item);
            if (index >= visibleCount) item.style.maxHeight = "0px";
            else item.style.maxHeight = `${item.scrollHeight}px`;
          });
          button.style.display = visibleCount >= items.length ? "none" : "";
        }
        if (moreOpenText) moreOpenText.style.display = "";
        if (moreCloseText) moreCloseText.style.display = "none";
      }, "resetInitialState");
      const showAllItems = /* @__PURE__ */ __name(() => {
        if (!isLinesMode) {
          items.forEach((item) => item.style.maxHeight = `${item.scrollHeight}px`);
        }
        wrapper.classList.add("active");
        button.classList.add("active");
      }, "showAllItems");
      const buttonHandler = /* @__PURE__ */ __name(() => {
        if (isLinesMode) {
          toggleLinesMode();
          return;
        }
        if (stepCount === "all") {
          showAllItems();
          button.remove();
          return;
        }
        if (stepCount === "toggle") {
          if (!isToggleActive) {
            showAllItems();
            isToggleActive = true;
            if (moreOpenText) moreOpenText.style.display = "none";
            if (moreCloseText) moreCloseText.style.display = "";
          } else {
            isToggleActive = false;
            items.forEach((item, index) => {
              if (index < visibleCount) {
                item.style.maxHeight = `${item.scrollHeight}px`;
              } else {
                item.style.maxHeight = "0px";
              }
            });
            if (moreOpenText) moreOpenText.style.display = "";
            if (moreCloseText) moreCloseText.style.display = "none";
            wrapper.classList.remove("active");
            button.classList.remove("active");
          }
          return;
        }
        const step = parseInt(stepCount);
        visibleCount += step;
        items.forEach((item, index) => {
          if (index < visibleCount) item.style.maxHeight = `${item.scrollHeight}px`;
        });
        if (visibleCount >= items.length) {
          button.style.display = "none";
          wrapper.classList.add("active");
          button.classList.add("active");
        }
      }, "buttonHandler");
      const handleMediaQuery = /* @__PURE__ */ __name((e) => {
        if (!e.matches) {
          showAllItems();
        } else {
          hiddenElements.forEach((span) => {
            const children = Array.from(span.childNodes);
            span.replaceWith(...children);
          });
          hiddenElements = [];
          resetInitialState();
          button.addEventListener("click", buttonHandler);
        }
      }, "handleMediaQuery");
      const initialize = /* @__PURE__ */ __name(() => {
        resetInitialState();
        button.addEventListener("click", buttonHandler);
        if (isLinesMode && linesTarget) {
          hiddenElements.forEach((span) => {
            const children = Array.from(span.childNodes);
            span.replaceWith(...children);
          });
          hiddenElements = [];
          const fullHeight = linesTarget.scrollHeight;
          hiddenElements = limitLines(linesTarget, initialCount);
          const limitedHeight = linesTarget.scrollHeight;
          if (fullHeight <= limitedHeight) {
            button.remove();
          }
          linesTarget.setAttribute("data-default-height", limitedHeight);
        }
      }, "initialize");
      if (mediaBreakpoint) {
        const queryType = mediaBreakpointType === "min" ? "min-width" : "max-width";
        mediaQuery = window.matchMedia(`(${queryType}: ${mediaBreakpoint}px)`);
        mediaQuery.addEventListener("change", handleMediaQuery);
        handleMediaQuery(mediaQuery);
      } else {
        initialize();
      }
      const recalcLines = /* @__PURE__ */ __name(() => {
        if (!isLinesMode || !linesTarget) return;
        linesTarget.innerHTML = linesTarget.dataset.original;
        hiddenElements = limitLines(linesTarget, initialCount);
        if (button) {
          button.style.display = hiddenElements.length ? "" : "none";
        }
        linesTarget.classList.remove("active");
        wrapper.classList.remove("active");
        button.classList.remove("active");
        if (moreOpenText) moreOpenText.style.display = "";
        if (moreCloseText) moreCloseText.style.display = "none";
      }, "recalcLines");
      window.addEventListener("resize", debounce(recalcLines, 100));
      recalcLines();
    });
  }
  __name(showMore, "showMore");

  function limitLines(element, maxLines) {
    let totalLines = 0;
    const hiddenSpans = [];

    function processTextNode(node, parent) {
      if (!node.textContent.trim()) return;
      const range2 = document.createRange();
      range2.selectNodeContents(parent);
      const rects = range2.getClientRects();
      if (rects.length === 0) return;
      if (totalLines >= maxLines) {
        const span = document.createElement("span");
        span.className = "hidd";
        parent.insertBefore(span, node);
        span.appendChild(node);
        hiddenSpans.push(span);
        return;
      }
      if (totalLines + rects.length > maxLines) {
        const tempRange = document.createRange();
        tempRange.setStart(node, 0);
        let found = false;
        let charIndex = 0;
        let lastGoodIndex = 0;
        while (!found && charIndex < node.textContent.length) {
          tempRange.setEnd(node, charIndex + 1);
          const tempRects = tempRange.getClientRects();
          if (tempRects.length > 0) {
            if (tempRects[tempRects.length - 1].bottom > rects[maxLines - totalLines - 1].bottom) {
              found = true;
            } else {
              lastGoodIndex = charIndex + 1;
            }
          }
          charIndex++;
        }
        if (found) {
          const visibleText = node.textContent.substring(0, lastGoodIndex);
          const hiddenText = node.textContent.substring(lastGoodIndex);
          const hiddenNode = document.createTextNode(hiddenText);
          const span = document.createElement("span");
          span.className = "hidd";
          span.appendChild(hiddenNode);
          node.textContent = visibleText;
          parent.insertBefore(span, node.nextSibling);
          hiddenSpans.push(span);
          totalLines = maxLines;
        } else {
          totalLines += rects.length;
        }
      } else {
        totalLines += rects.length;
      }
    }
    __name(processTextNode, "processTextNode");

    function walkNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node, node.parentNode);
      } else if (node.nodeType === Node.ELEMENT_NODE && totalLines < maxLines) {
        Array.from(node.childNodes).forEach(walkNodes);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const span = document.createElement("span");
        span.className = "hidd";
        node.parentNode.insertBefore(span, node);
        span.appendChild(node);
        hiddenSpans.push(span);
      }
    }
    __name(walkNodes, "walkNodes");
    Array.from(element.childNodes).forEach(walkNodes);
    return hiddenSpans;
  }
  __name(limitLines, "limitLines");

  // src/assets/js/components.js
  slider();
  gallery();
  rating();
  fixedMenu();
  tooltip();
  form();
  map();
  burger();
  numbers();
  video();
  scroll();
  range();
  select();
  text();
  popup2();
  spoller();
  tab();
  subMenu();
  showMore();
})();
//# sourceMappingURL=script.js.map