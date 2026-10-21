// Client-side validation for the assessment contact form. Does not send messages.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const fields = ["name", "email", "phone", "message"];
  const showError = (name, message) => {
    const input = document.getElementById(name);
    const wrapper = input.closest(".form-field");
    wrapper.classList.toggle("invalid", Boolean(message));
    document.getElementById(`${name}-error`).textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
  };
  form.addEventListener("submit", event => {
    event.preventDefault();
    status.textContent = ""; status.classList.remove("error");
    const values = Object.fromEntries(fields.map(name => [name, document.getElementById(name).value.trim()]));
    let valid = true;
    fields.forEach(name => {
      let error = "";
      if (!values[name]) error = "This field is required.";
      else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) error = "Enter a valid email address.";
      else if (name === "phone" && !/^\d+$/.test(values.phone)) error = "Use digits only, with no spaces or symbols.";
      showError(name, error);
      if (error) valid = false;
    });
    if (!valid) {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.classList.add("error");
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    status.textContent = "Validation successful. This demo does not send messages; please email David directly at davidokoro2002@gmail.com.";
  });
  fields.forEach(name => document.getElementById(name).addEventListener("input", () => showError(name, "")));
});
