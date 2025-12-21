import { debounce } from "./core/helpers";
import { loaded } from "./core/dom";
import { isSafari, checkWebp } from "./ui/browser";
import { checkBurgerAndMenu } from "./core/checks";

// Проверка на браузер safari
if (isSafari) document.documentElement.classList.add("safari");

// Проверка поддержки webp
checkWebp();

// Закрытие бургера на десктопе
window.addEventListener("resize", debounce(checkBurgerAndMenu, 100));
checkBurgerAndMenu();

// Добавление класса loaded при загрузке страницы
loaded();
