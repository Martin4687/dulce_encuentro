document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const toggle = document.getElementById("navToggle");
  const header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Cuenta regresiva hasta la apertura
  const countdown = document.getElementById("countdown");
  if (countdown) {
    const target = new Date(countdown.dataset.target).getTime();
    const nums = {
      dias: countdown.querySelector('[data-unit="dias"]'),
      horas: countdown.querySelector('[data-unit="horas"]'),
      min: countdown.querySelector('[data-unit="min"]'),
      seg: countdown.querySelector('[data-unit="seg"]'),
    };

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const min = Math.floor((diff / (1000 * 60)) % 60);
      const seg = Math.floor((diff / 1000) % 60);

      nums.dias.textContent = pad(dias);
      nums.horas.textContent = pad(horas);
      nums.min.textContent = pad(min);
      nums.seg.textContent = pad(seg);

      if (diff <= 0) clearInterval(intervalId);
    };

    tick();
    const intervalId = setInterval(tick, 1000);
  }

  // Auto-cierre de mensajes flash
  document.querySelectorAll(".flash").forEach((el) => {
    setTimeout(() => {
      el.style.transition = "opacity 0.4s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, 5000);
  });

  // Envío del formulario de contacto vía fetch (funciona igual con Flask
  // corriendo en local, y con Netlify Forms una vez desplegado como
  // sitio estático — ver la guía de Netlify para el detalle).
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const datos = new FormData(form);
      const cuerpo = new URLSearchParams(datos).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: cuerpo,
      })
        .then(() => {
          mostrarMensaje("¡Gracias! Te esperamos en la apertura.", "success");
          launchConfetti();
          form.reset();
        })
        .catch(() => {
          mostrarMensaje("No pudimos enviar tu mensaje. Escríbenos por WhatsApp.", "error");
        });
    });
  }

  function mostrarMensaje(texto, tipo) {
    const stack = document.querySelector(".flash-stack") || (() => {
      const el = document.createElement("div");
      el.className = "flash-stack";
      document.body.appendChild(el);
      return el;
    })();

    const aviso = document.createElement("div");
    aviso.className = `flash flash--${tipo}`;
    aviso.textContent = texto;
    stack.appendChild(aviso);

    setTimeout(() => {
      aviso.style.transition = "opacity 0.4s ease";
      aviso.style.opacity = "0";
      setTimeout(() => aviso.remove(), 400);
    }, 5000);
  }

  function launchConfetti() {
    const colors = ["#FF3D80", "#FFC93C", "#1FA9E1", "#FF7A3D", "#3DDC97"];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3200);
    }
  }
});
