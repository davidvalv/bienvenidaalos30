const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("img").forEach((image) => {
  const markMissing = () => {
    const parent = image.parentElement;
    parent.classList.add("is-missing");
    parent.dataset.fallback = image.dataset.fallback || "Archivo";
    image.remove();
  };

  image.addEventListener(
    "error",
    markMissing,
    { once: true }
  );

  if (image.complete && image.naturalWidth === 0) {
    markMissing();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const end = Number(target.dataset.countTo);
      if (reduceMotion || !Number.isFinite(end)) {
        target.textContent = String(end);
        counterObserver.unobserve(target);
        return;
      }

      const duration = 950;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = String(Math.round(end * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count-to]").forEach((element) => counterObserver.observe(element));

const tickerTrack = document.querySelector(".ticker__track");
if (tickerTrack) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

const colors = ["#9e2420", "#f0c766", "#1e4d5f", "#3f5a3b", "#fffaf0"];
const confettiButton = document.querySelector(".confetti-trigger");

confettiButton?.addEventListener("click", () => {
  if (reduceMotion) return;

  for (let index = 0; index < 44; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDelay = `${Math.random() * 260}ms`;
    piece.style.background = colors[index % colors.length];
    piece.style.transform = `rotate(${Math.random() * 90}deg)`;
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 1600);
  }
});
