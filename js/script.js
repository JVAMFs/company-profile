// ========= Utilities =========
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const setText = (sel, text) => {
  const el = $(sel);
  if (el) el.textContent = text;
};

// ========= Navbar (mobile) =========
document.addEventListener("DOMContentLoaded", () => {
  const year = new Date().getFullYear();
  setText("#year", year);

  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  initGreeting();
  initNameForm();
  initContactForm();
});

// ========= Greeting "Hi, Name" =========
function initGreeting() {
  const saved = localStorage.getItem("greetName");
  const greetEl = $("#greetName");
  greetEl.textContent = saved ? saved : "there";
}

function initNameForm() {
  const form = $("#nameForm");
  const input = $("#nameInput");
  const resetBtn = $("#resetName");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (input.value || "").trim();
    if (name.length < 2) {
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    $("#greetName").textContent = name;
    localStorage.setItem("greetName", name);
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("greetName");
    $("#greetName").textContent = "there";
    $("#nameInput").value = "";
  });
}

// ========= Form Validation & Output =========
function initContactForm() {
  const form = $("#contactForm");

  const fields = {
    fullName: {
      el: $("#fullName"),
      err: $("#err-fullName"),
      validate: (v) =>
        v.trim().length >= 2 ? "" : "Name must be at least 2 characters.",
    },
    email: {
      el: $("#email"),
      err: $("#err-email"),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? ""
          : "Please enter a valid email address.",
    },
    phone: {
      el: $("#phone"),
      err: $("#err-phone"),
      validate: (v) => {
        const digits = v.replace(/[^\d]/g, "");
        if (digits.length < 8) return "Phone must be at least 8 digits.";
        if (!/^\d{8,15}$/.test(digits))
          return "Phone should contain digits only (8–15).";
        return "";
      },
    },
    message: {
      el: $("#message"),
      err: $("#err-message"),
      validate: (v) =>
        v.trim().length >= 10 ? "" : "Message must be at least 10 characters.",
    },
  };

  // live validation on blur/input
  Object.values(fields).forEach(({ el, err, validate }) => {
    const run = () => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    el.addEventListener("blur", run);
    el.addEventListener("input", () => {
      if (el.getAttribute("aria-invalid") === "true") run();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // validate all
    let hasError = false;
    Object.values(fields).forEach(({ el, err, validate }) => {
      const msg = validate(el.value);
      err.textContent = msg;
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg && !hasError) {
        el.focus();
        hasError = true;
      }
    });
    if (hasError) return;

    // show values to HTML
    $("#outName").textContent = fields.fullName.el.value.trim();
    $("#outEmail").textContent = fields.email.el.value.trim();
    $("#outPhone").textContent = fields.phone.el.value.replace(/[^\d]/g, "");
    $("#outMessage").textContent = fields.message.el.value.trim();

    const dl = $("#submittedData");
    dl.hidden = false;
    $(".panel .muted")?.remove();

    // optional UX: reset form
    form.reset();
    // remove invalid states
    Object.values(fields).forEach(({ el }) =>
      el.removeAttribute("aria-invalid")
    );
  });
}
