"use strict";

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // =========================
  // Drawer
  // =========================
  const hamburger = $("#js-hamburger");
  const drawer = $("#js-drawer");
  const overlay = $("#js-drawerOverlay");
  const closeBtn = $("#js-drawerClose");

  const openDrawer = () => {
    if (!hamburger || !drawer || !overlay) return;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    if (!hamburger || !drawer || !overlay) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (hamburger) hamburger.addEventListener("click", openDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  if (drawer) {
    drawer.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeDrawer();
    });
  }

  // =========================
  // ToTop
  // =========================
  const toTop = $("#js-toTop");
  const SHOW_Y = 520;

  const updateToTop = () => {
    if (!toTop) return;
    if (window.scrollY > SHOW_Y) toTop.classList.add("is-show");
    else toTop.classList.remove("is-show");
  };

  if (toTop) {
    updateToTop();
    window.addEventListener("scroll", updateToTop, { passive: true });
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================
  // TOP Hero: cinematic crossfade（ちかちか防止）
  // =========================
  const heroA = $("#js-heroA");
  const heroB = $("#js-heroB");
  const heroWrap = $(".hero-top");

  if (heroA && heroB && heroWrap) {
    const heroImages = [
      "./images/top01.png", // 最初は即表示
      "./images/top02.png",
      "./images/top03.png",
    ];

    // 先読み（チラつき防止）
    heroImages.forEach((src) => {
      const im = new Image();
      im.src = src;
    });

    let i = 0;
    let front = heroA; // 表
    let back = heroB; // 裏

    // 初期：即表示
    front.src = heroImages[0];
    front.classList.add("is-active");
    back.classList.remove("is-active");

    const INTERVAL = 4200; // ←0.5秒は禁止、雰囲気寄せ
    const SWITCH_AT = 180; // 暗転開始→ちょい待って切替
    const DIM_OUT = 640;

    setInterval(() => {
      const nextIndex = (i + 1) % heroImages.length;

      // 次を裏に仕込む
      back.src = heroImages[nextIndex];

      // 暗転
      heroWrap.classList.add("is-dim");

      // クロスフェード
      window.setTimeout(() => {
        back.classList.add("is-active");
        front.classList.remove("is-active");
      }, SWITCH_AT);

      // 暗転解除
      window.setTimeout(() => {
        heroWrap.classList.remove("is-dim");
      }, DIM_OUT);

      // 入れ替え
      i = nextIndex;
      const tmp = front;
      front = back;
      back = tmp;
    }, INTERVAL);
  }

  // =========================
  // WORKS: manual + autoplay carousel
  // =========================
  const worksBox = $("#js-works");
  const worksImg = $("#js-worksImg");
  const worksCap = $("#js-worksCaption");
  const worksPrev = $(".works-arrow--prev");
  const worksNext = $(".works-arrow--next");

  if (worksBox && worksImg && worksCap && worksPrev && worksNext) {
    const worksItems = [
      { src: "./images/works02.png", cap: "— 呼継ぎ —<br>異素材を呼び継ぐ" },
      { src: "./images/works01.png", cap: "— 金継ぎ —<br>うつわを継ぐ" },
      { src: "./images/works03.png", cap: "— Accessory —<br>身につける工藝" },
    ];

    // 先読み
    worksItems.forEach((it) => {
      const im = new Image();
      im.src = it.src;
    });

    let idx = 0;
    const AUTO_MS = 3500;
    const FADE_MS = 200;

    const render = (dir) => {
      worksImg.classList.remove("slide-left", "slide-right");
      worksImg.classList.add(dir === "next" ? "slide-left" : "slide-right");

      worksImg.classList.add("is-fade");
      window.setTimeout(() => {
        worksImg.src = worksItems[idx].src;
        worksCap.innerHTML = worksItems[idx].cap;

        worksImg.classList.remove("is-fade");
        worksImg.classList.remove("slide-left", "slide-right");
      }, FADE_MS);
    };

    const next = () => {
      idx = (idx + 1) % worksItems.length;
      render("next");
    };
    const prev = () => {
      idx = (idx - 1 + worksItems.length) % worksItems.length;
      render("prev");
    };

    let timer = null;
    const startAuto = () => {
      stopAuto();
      timer = window.setInterval(next, AUTO_MS);
    };
    const stopAuto = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };
    const restartAuto = () => {
      stopAuto();
      startAuto();
    };

    worksNext.addEventListener("click", () => {
      next();
      restartAuto();
    });
    worksPrev.addEventListener("click", () => {
      prev();
      restartAuto();
    });

    worksBox.addEventListener("mouseenter", stopAuto);
    worksBox.addEventListener("mouseleave", startAuto);

    startAuto();
  }

  // =========================
  // HERO 金継ぎ演出（REPAIR / ACCESSORY）
  // - .hero-kintsugi に .is-reveal を付けるだけ
  // =========================
  const kintsugiHeros = $$(".hero-kintsugi");

  if (kintsugiHeros.length) {
    const reveal = (el) => el.classList.add("is-reveal");

    // まずは即（最上部にいる場合）
    kintsugiHeros.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7) reveal(el);
    });

    // スクロール発火（IntersectionObserver）
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((ent) => {
            if (ent.isIntersecting) {
              reveal(ent.target);
              io.unobserve(ent.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      kintsugiHeros.forEach((el) => io.observe(el));
    } else {
      // 古い環境の保険
      window.addEventListener(
        "scroll",
        () => {
          kintsugiHeros.forEach((el) => {
            if (el.classList.contains("is-reveal")) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.7) reveal(el);
          });
        },
        { passive: true }
      );
    }
  }
})();
