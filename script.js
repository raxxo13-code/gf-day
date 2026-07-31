const revealButton = document.getElementById("revealButton");
const storySection = document.getElementById("storySection");
const heartRain = document.querySelector(".heart-rain");
const revealBlocks = document.querySelectorAll(".reveal-block, .reveal-item, .letter-card h3");
const typewriterTargets = Array.from(document.querySelectorAll("[data-typewriter]"));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setVisible(element) {
  element.classList.add("is-visible");
}

function animateTypewriter(element) {
  const target = element.querySelector("span");
  const text = element.getAttribute("data-typewriter") || "";
  let currentIndex = 0;
  target.textContent = "";

  return new Promise((resolve) => {
    if (prefersReducedMotion) {
      target.textContent = text;
      resolve();
      return;
    }

    const interval = window.setInterval(() => {
      currentIndex += 1;
      target.textContent = text.slice(0, currentIndex);

      if (currentIndex >= text.length) {
        window.clearInterval(interval);
        resolve();
      }
    }, 10);
  });
}

async function playTypewriterSequence() {
  if (prefersReducedMotion) {
    typewriterTargets.forEach((element) => {
      setVisible(element);
      const target = element.querySelector("span");
      target.textContent = element.getAttribute("data-typewriter") || "";
    });
    return;
  }

  for (const element of typewriterTargets) {
    setVisible(element);
    await animateTypewriter(element);
  }
}

function launchHearts(count = 18) {
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = Math.random() > 0.5 ? "❤" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty("--drift", `${(Math.random() * 220 - 110).toFixed(0)}px`);
    heart.style.animationDuration = `${4.8 + Math.random() * 2.4}s`;
    heart.style.fontSize = `${14 + Math.random() * 20}px`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    heartRain.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, 7600);
  }
}

function revealStory() {
  storySection.classList.add("show");
  launchHearts();
  storySection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  revealButton.textContent = "Our memories are open";
  revealButton.disabled = true;
  playTypewriterSequence();
}

revealButton.addEventListener("click", revealStory);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      setVisible(entry.target);
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.22,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealBlocks.forEach((element) => observer.observe(element));

if (prefersReducedMotion) {
  typewriterTargets.forEach((element) => {
    const target = element.querySelector("span");
    target.textContent = element.getAttribute("data-typewriter") || "";
  });
}