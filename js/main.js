/**
 * Yahya Al-Aref portfolio — vanilla JS only.
 * - Scroll reveal: .reveal elements get .is-visible when scrolled into view.
 * - Counters: [data-count] numeric attributes animate when visible (IntersectionObserver),
 *   or animate immediately if IntersectionObserver is not available.
 */
(function () {
  "use strict";

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  function animateCount(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString("en-US");
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("en-US");
      }
    }
    requestAnimationFrame(step);
  }

  function parseCountAttr(raw) {
    return parseInt(String(raw).replace(/,/g, ""), 10);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function observeOne(el) {
      var raw = el.getAttribute("data-count");
      var target = parseCountAttr(raw);
      if (isNaN(target)) return;

      if (!("IntersectionObserver" in window)) {
        animateCount(el, target, 1400);
        return;
      }

      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            animateCount(entry.target, target, 1400);
          });
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
    }

    counters.forEach(observeOne);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
  });
})();
