const yearElement = document.querySelector("#year");
const tabs = document.querySelectorAll(".work-tab");
const panels = document.querySelectorAll("[data-work-panel]");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeLightboxButton = document.querySelector(".lightbox-close");
const lightboxPrevButton = document.querySelector(".lightbox-prev");
const lightboxNextButton = document.querySelector(".lightbox-next");

let activeImages = [];
let activeImageIndex = 0;

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedWork = tab.dataset.work;

    tabs.forEach((currentTab) => {
      const isActive = currentTab === tab;
      currentTab.classList.toggle("active", isActive);
      currentTab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.workPanel === selectedWork);
    });
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const previousButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");

  previousButton?.addEventListener("click", () => moveCarousel(track, -1));
  nextButton?.addEventListener("click", () => moveCarousel(track, 1));
});

document.querySelectorAll(".gallery-image").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.closest("[data-work-panel]");
    const images = [...panel.querySelectorAll(".gallery-image img")];
    const selectedImage = button.querySelector("img");

    activeImages = images;
    activeImageIndex = images.indexOf(selectedImage);
    openLightbox();
  });
});

closeLightboxButton?.addEventListener("click", closeLightbox);
lightboxPrevButton?.addEventListener("click", () => showLightboxImage(activeImageIndex - 1));
lightboxNextButton?.addEventListener("click", () => showLightboxImage(activeImageIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showLightboxImage(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showLightboxImage(activeImageIndex + 1);
  }
});

function moveCarousel(track, direction) {
  if (!track) {
    return;
  }

  const scrollAmount = Math.max(track.clientWidth * 0.82, 280);
  track.scrollBy({
    left: scrollAmount * direction,
    behavior: "smooth",
  });
}

function openLightbox() {
  if (!lightbox || !lightboxImage || activeImageIndex < 0) {
    return;
  }

  showLightboxImage(activeImageIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeLightboxButton?.focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function showLightboxImage(index) {
  if (!lightboxImage || activeImages.length === 0) {
    return;
  }

  activeImageIndex = (index + activeImages.length) % activeImages.length;
  const currentImage = activeImages[activeImageIndex];

  lightboxImage.src = currentImage.currentSrc || currentImage.src;
  lightboxImage.alt = currentImage.alt;
}
