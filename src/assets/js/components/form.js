import { successSubmitForm } from "../scripts/forms/validation";
import { validation } from "../scripts/forms/validation";

/* 
	================================================
	  
	Отправка форм
	
	================================================
*/

export function form() {
  const allForms = document.querySelectorAll("form");

  allForms.forEach((form) => {
    if (form.classList.contains("wpcf7-form")) return;

    if (!form.hasAttribute("enctype")) {
      form.setAttribute("enctype", "multipart/form-data");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // let isValid = true;

      // form.querySelectorAll('input[type="tel"]').forEach((input) => {
      //   const val = input.value.trim();
      //   const requiredLength = val.startsWith("+7") ? 17 : val.startsWith("8") ? 16 : Infinity;

      //   if (val.length < requiredLength && val.length > 3) {
      //     input.setCustomValidity("Телефон должен содержать 11 цифр");
      //     input.reportValidity();
      //     isValid = false;
      //   } else {
      //     input.setCustomValidity("");
      //   }
      // });

      // if (typeof checkRequiredChoice === "function") {
      //   checkRequiredChoice();
      // }

      // if (!isValid || !form.checkValidity()) {
      //   form.reportValidity();
      //   return;
      // }

      form.classList.add("sending");

      try {
        const formData = new FormData(form);

        const mailResponse = await fetch("/mail.php", {
          method: "POST",
          body: formData,
        });

        const wpFormData = new FormData(form);
        wpFormData.append("action", "submit_request");

        const wpResponse = await fetch("/wp-admin/admin-ajax.php", {
          method: "POST",
          body: wpFormData,
          credentials: "same-origin",
        });

        const wpResult = await wpResponse.json();

        if (mailResponse.ok && wpResult.success) {
          successSubmitForm(form);
        } else {
          console.error("Ошибка при отправке:", {
            mail: mailResponse,
            wp: wpResult,
          });
        }
      } catch (err) {
        console.error("Ошибка сети:", err);
      } finally {
        form.classList.remove("sending");
      }
    });
  });
}
