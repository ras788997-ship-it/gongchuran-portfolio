/* 龚楚然 · 求职作品集 — 轻量交互，无依赖 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky topbar state ---------- */
  var topbar = document.getElementById("topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- draw the project path when it enters view ---------- */
  var workSection = document.querySelector(".work");
  if (workSection && !reduceMotion && "IntersectionObserver" in window) {
    var workIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          workSection.classList.add("is-in");
          workIO.disconnect();
        }
      });
    }, { threshold: 0.15 });
    workIO.observe(workSection);
  } else if (workSection) {
    workSection.classList.add("is-in");
  }

  /* ---------- contact page panels ---------- */
  var toggleButtons = Array.prototype.slice.call(document.querySelectorAll("[data-toggle]"));
  toggleButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById("panel-" + btn.getAttribute("data-toggle"));
      if (!panel) return;
      var willOpen = !panel.classList.contains("is-open");
      panel.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (willOpen) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  });

  /* 从 #resume 直达/点击时自动展开下载简历，并滚到结尾页 */
  var openResumeFromHash = function () {
    if (location.hash !== "#resume") return;
    var resumeBtn = document.querySelector('[data-toggle="resume"]');
    if (!resumeBtn) return;
    window.setTimeout(function () {
      if (resumeBtn.getAttribute("aria-expanded") !== "true") resumeBtn.click();
      var contactSection = document.getElementById("contact");
      if (contactSection) contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };
  openResumeFromHash();
  window.addEventListener("hashchange", openResumeFromHash);

  /* ---------- 移动端菜单（由现有导航生成，不额外改 HTML） ---------- */
  var topbarEl = document.getElementById("topbar");
  if (topbarEl && !topbarEl.querySelector(".navtoggle")) {
    var rightBox = topbarEl.querySelector(".topbar__right");
    if (rightBox) {
      var navBtn = document.createElement("button");
      navBtn.type = "button";
      navBtn.className = "navtoggle";
      navBtn.setAttribute("aria-label", "打开菜单");
      navBtn.setAttribute("aria-expanded", "false");
      navBtn.setAttribute("aria-controls", "mobilemenu");
      navBtn.innerHTML = "<span></span><span></span><span></span>";
      rightBox.appendChild(navBtn);

      var menu = document.createElement("nav");
      menu.className = "mobilemenu";
      menu.id = "mobilemenu";
      menu.setAttribute("aria-label", "移动端导航");
      menu.setAttribute("aria-hidden", "true");

      var label = document.createElement("div");
      label.className = "mobilemenu__label";
      label.textContent = "Navigation · 导航";
      menu.appendChild(label);

      var items = [];
      var leftLinks = topbarEl.querySelectorAll(".topbar__left a");
      Array.prototype.forEach.call(leftLinks, function (a) {
        items.push({ href: a.getAttribute("href"), text: a.textContent.trim(), cls: "" });
      });
      items.push({ href: "contact.html", text: "联系方式", cls: "mobilemenu__contact" });
      items.push({ href: "contact.html#resume", text: "下载简历", cls: "" });

      items.forEach(function (item, i) {
        var a = document.createElement("a");
        a.href = item.href;
        if (item.cls) a.className = item.cls;
        a.innerHTML = "<span class='mobilemenu__t'>" + item.text + "</span><span>" + String(i + 1).padStart(2, "0") + " →</span>";
        menu.appendChild(a);
      });

      topbarEl.parentNode.insertBefore(menu, topbarEl.nextSibling);

      var setMenu = function (open) {
        navBtn.setAttribute("aria-expanded", open ? "true" : "false");
        navBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
        menu.classList.toggle("is-open", open);
        menu.setAttribute("aria-hidden", open ? "false" : "true");
        document.body.style.overflow = open ? "hidden" : "";
      };
      navBtn.addEventListener("click", function () {
        setMenu(navBtn.getAttribute("aria-expanded") !== "true");
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setMenu(false);
      });
      window.addEventListener("resize", function () {
        if (window.innerWidth > 620) setMenu(false);
      });
    }
  }

  /* ---------- 联系方式弹窗（首页/详情页右上角「联系我」） ---------- */
  var contactTriggers = Array.prototype.slice.call(document.querySelectorAll("[data-contact-open]"));
  if (contactTriggers.length && !document.getElementById("contact-modal")) {
    var modal = document.createElement("div");
    modal.className = "contact-modal";
    modal.id = "contact-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-labelledby", "contact-modal-title");
    modal.innerHTML = [
      '<div class="contact-modal__panel">',
      '<button class="contact-modal__close" type="button" aria-label="关闭联系方式">×</button>',
      '<span class="kicker">Contact · 联系方式</span>',
      '<h2 id="contact-modal-title">怎么联系我？</h2>',
      '<p class="contact-modal__hint">优先邮件；电话仅用于求职沟通，请勿用于营销。</p>',
      '<div class="contact-modal__list">',
      '<a href="mailto:ras788997@gmail.com"><span>Email</span><strong>ras788997@gmail.com</strong></a>',
      '<a href="tel:+8613577404580"><span>Phone</span><strong>135 7740 4580</strong></a>',
      '<div><span>City</span><strong>重庆 · 成都 · 昆明</strong></div>',
      '<div><span>Status</span><strong>2026 届本科 · 寻找 AI 应用交付 / 前沿部署 / 测试岗位</strong></div>',
      '</div>',
      '<div class="contact-modal__resume">',
      '<a href="assets/docs/resume-delivery.pdf" download="龚楚然-简历-AI应用交付工程师.pdf"><small>PDF · 交付方向</small>AI 应用交付工程师 ↓</a>',
      '<a href="assets/docs/resume-fde.pdf" download="龚楚然-简历-AI应用前沿部署工程师（FDE）.pdf"><small>PDF · FDE 方向</small>AI 应用前沿部署工程师（FDE） ↓</a>',
      '<a href="assets/docs/resume-test.pdf" download="龚楚然-简历-AI应用测试工程师.pdf"><small>PDF · 测试方向</small>AI 应用测试工程师 ↓</a>',
      '</div>',
      '<a class="contact-modal__full" href="index.html#contact">查看完整结尾页 <span aria-hidden="true">→</span></a>',
      '</div>'
    ].join("");
    document.body.appendChild(modal);

    var closeBtn = modal.querySelector(".contact-modal__close");
    var lastFocus = null;

    var openModal = function () {
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      window.setTimeout(function () { closeBtn.focus(); }, 40);
    };
    var closeModal = function () {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    contactTriggers.forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    modal.addEventListener("click", function (e) {
      if (e.target.closest("a")) window.setTimeout(closeModal, 120);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- 页脚年份（固定 2026，留作维护） ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) { el.textContent = "2026"; });
})();
