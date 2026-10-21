// Shared navigation, year and touch/mouse-following honey light.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }
  document.querySelectorAll(".current-year").forEach(el => el.textContent = new Date().getFullYear());

  // The warm glow follows mouse movement and touch input across the viewport.
  const glow = document.querySelector(".cursor-glow");
  if (glow) {
    let hideTimer;
    const moveGlow = (x, y) => {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.classList.add("is-visible");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => glow.classList.remove("is-visible"), 1300);
    };
    window.addEventListener("pointermove", event => {
      // Mouse and pen movement; touch devices are handled by pointerdown/move below.
      if (event.pointerType !== "touch") moveGlow(event.clientX, event.clientY);
    }, { passive: true });
    window.addEventListener("pointerdown", event => moveGlow(event.clientX, event.clientY), { passive: true });
    window.addEventListener("pointerup", () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => glow.classList.remove("is-visible"), 900);
    }, { passive: true });
  }
});
