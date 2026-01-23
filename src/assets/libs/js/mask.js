window.addEventListener("DOMContentLoaded", () => {
  maskPhone();
});

function maskPhone() {
  const phoneInputs = document.querySelectorAll('[type="tel"]');

  phoneInputs.forEach((input) => {
    input.setAttribute("data-original-placeholder", input.placeholder);

    input.addEventListener("focus", function () {
      if (!this.value) {
        this.value = "+7 (";
        this.placeholder = "";
      }
      setTimeout(() => {
        this.setSelectionRange(this.value.length, this.value.length);
      }, 0);
    });

    input.addEventListener("blur", function () {
      if (this.value == "+7 (") {
        this.value = "";
        this.placeholder = this.getAttribute("data-original-placeholder");
      }
    });

    input.addEventListener("input", function (event) {
      const isDelete = event.inputType === "deleteContentBackward";
      let raw = this.value;
      const digits = raw.replace(/\D/g, "");

      if (isDelete) {
        return;
      }

      let formatted = formatWithMask(digits);

      this.value = formatted;

      setTimeout(() => {
        const pos = this.value.indexOf("_");
        setCursorPosition(this, pos === -1 ? this.value.length : pos);
      }, 0);
    });

    input.addEventListener("change", function () {
      const digits = this.value.replace(/\D/g, "");

      if (digits.length === 0) {
        this.setCustomValidity("");
        this.classList.remove("error");
        return;
      }

      if (digits.length < 11) {
        if (this.hasAttribute("required")) {
          this.setCustomValidity("Телефон должен содержать 11 цифр");
          this.reportValidity();
        } else {
          this.setCustomValidity("");
        }

        this.classList.add("error");
      } else {
        this.setCustomValidity("");
        this.classList.remove("error");
      }
    });

    input.addEventListener("paste", function (e) {
      e.preventDefault();
      let pasted = (e.clipboardData || window.clipboardData).getData("text");
      pasted = pasted.replace(/\D/g, "");
      this.value = formatWithMask(pasted);
    });
  });

  function formatWithMask(digits) {
    if (!digits) return "";

    if (digits[0] !== "7" && digits[0] !== "8") {
      digits = "7" + digits;
    }

    const mask = digits[0] === "8" ? "8 (___) ___ __ __" : "+7 (___) ___ __ __";

    let i = 0;
    let formatted = "";

    for (const char of mask) {
      if (i >= digits.length) break;
      if (char === "_" || /\d/.test(char)) {
        formatted += digits[i++];
      } else {
        formatted += char;
      }
    }

    return formatted;
  }

  function setCursorPosition(el, pos) {
    el.setSelectionRange(pos, pos);
  }
}
