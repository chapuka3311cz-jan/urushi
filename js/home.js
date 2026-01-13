"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
  Hero slideshow (Top)
========================= */
(function initHeroSlideshow() {
  const layers = $$(".hero-bg__layer");
  if (layers.length === 0) return;

  let idx = 0;
  layers[0].classList.add("is-on");

  setInterval(() => {
    layers[idx].classList.remove("is-on");
    idx = (idx + 1) % layers.length;
    layers[idx].classList.add("is-on");
  }, 4200); // “ふんわり”寄り、速すぎ厳禁
})();

/* =========================
  Works carousel (Top)
========================= */
(function initWorksCarousel() {
  const track = $("#js-carouselTrack");
  const btnPrev = $("#js-carouselPrev");
  const btnNext = $("#js-carouselNext");
  const slides = $$(".carousel-slide");
  if (!track || slides.length === 0 || !btnPrev || !btnNext) return;

  let current = 0;
  let timer = null;

  const update = () => {
    track.style.transform = `translateX(${-100 * current}%)`;
  };

  const next = () => {
    current = (current + 1) % slides.length;
    update();
  };

  const prev = () => {
    current = (current - 1 + slides.length) % slides.length;
    update();
  };

  const start = () => {
    stop();
    timer = setInterval(next, 2500);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  btnNext.addEventListener("click", () => {
    next();
    start();
  });
  btnPrev.addEventListener("click", () => {
    prev();
    start();
  });

  // ホバーで止める（PCのみ）
  const box = $("#js-worksCarousel");
  if (box) {
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", start);
  }

  start();
})();
