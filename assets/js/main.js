/* Personal site — small, dependency-free enhancements. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.dataset.ready = "1";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  var THEME_KEY = "personal-site-theme";
  var themeBtn = document.getElementById("themeBtn");
  var themeHint = document.getElementById("themeHint");
  var themeHintText = document.getElementById("themeHintText");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#e9e6e0" : "#0f0f11");
    if (themeBtn) themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (themeHintText) {
      themeHintText.textContent = theme === "light" ? "喵，点我换夜" : "喵，点我换日";
    }
  }

  var saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch (e) {}
  applyTheme(saved === "dark" ? "dark" : "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  var hintDismissed = false;
  var hintSeen = false;
  try {
    hintSeen = sessionStorage.getItem("theme-hint-seen") === "1";
  } catch (e) {}

  if (themeHint && !hintSeen && !reduce) {
    window.setTimeout(function () {
      if (!hintDismissed) themeHint.classList.add("show");
    }, 1200);
    window.setTimeout(function () {
      if (!hintDismissed) themeHint.classList.remove("show");
    }, 6200);
  }

  if (themeBtn && themeHint) {
    themeHint.addEventListener("click", function () {
      themeBtn.click();
    });
    themeBtn.addEventListener("click", function () {
      hintDismissed = true;
      themeHint.classList.remove("show");
      try {
        sessionStorage.setItem("theme-hint-seen", "1");
      } catch (e) {}
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  /* Elements already on screen at load should never wait for a scroll event. */
  Array.prototype.forEach.call(revealables, function (el) {
    var box = el.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.94) el.classList.add("in");
  });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealables.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- scroll progress + nav state + back to top ---------- */
  var bar = document.querySelector(".progress i");
  var nav = document.getElementById("nav");
  var toTop = document.getElementById("toTop");
  var ticking = false;

  function onScroll() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 700);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  function setActive() {
    var probe = window.scrollY + window.innerHeight * 0.32;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.offsetTop <= probe) current = s;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + (current ? current.id : ""));
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- copy to clipboard ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1900);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var done = function () {
        showToast("已复制：" + value);
        btn.classList.add("done");
        var original = btn.getAttribute("data-label") || btn.innerHTML;
        btn.setAttribute("data-label", original);
        btn.innerHTML = "已复制";
        setTimeout(function () {
          btn.classList.remove("done");
          btn.innerHTML = original;
        }, 1600);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {
          showToast("复制失败，请手动选择");
        }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- count up ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var start = performance.now();
          var dur = 900;
          function tick(now) {
            var t = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          co.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      co.observe(el);
    });
  }

  /* ---------- subtle tilt on the portrait ---------- */
  var tilt = document.getElementById("tilt");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (tilt && fine && !reduce) {
    var rect = null;
    tilt.addEventListener("pointerenter", function () {
      rect = tilt.getBoundingClientRect();
    });
    tilt.addEventListener("pointermove", function (e) {
      if (!rect) rect = tilt.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform =
        "perspective(900px) rotateY(" + (x * 7).toFixed(2) + "deg) rotateX(" +
        (-y * 7).toFixed(2) + "deg)";
    });
    tilt.addEventListener("pointerleave", function () {
      rect = null;
      tilt.style.transform = "";
    });
  }

  /* ---------- 30-second preview player ---------- */
  var audio = document.getElementById("audioPlayer");
  var listening = document.querySelector(".listening");
  var playerStatus = document.getElementById("playerStatus");
  var fullLink = document.getElementById("fullLink");
  var trackButtons = Array.prototype.slice.call(document.querySelectorAll(".track-btn"));
  var activeTrack = null;

  function trackLabel(btn) {
    return btn.getAttribute("data-title") + " — " + btn.getAttribute("data-artist");
  }

  function setPlayerStatus(text) {
    if (playerStatus) playerStatus.textContent = text;
  }

  function resetTrackButton(btn) {
    if (!btn) return;
    btn.classList.remove("is-playing");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "播放 " + trackLabel(btn));
  }

  trackButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!audio) return;
      var src = btn.getAttribute("data-src");
      var isSame = activeTrack === btn;

      if (isSame && !audio.paused) {
        audio.pause();
        return;
      }

      if (activeTrack && activeTrack !== btn) resetTrackButton(activeTrack);
      activeTrack = btn;

      if (!isSame || audio.getAttribute("src") !== src) {
        audio.src = src;
        audio.load();
        if (fullLink) fullLink.href = btn.getAttribute("data-link");
      }
      if (audio.ended) audio.currentTime = 0;

      var playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          resetTrackButton(btn);
          if (listening) listening.classList.remove("is-playing");
          setPlayerStatus("浏览器拦下了播放，请再点一次");
        });
      }
    });
  });

  if (audio) {
    audio.addEventListener("play", function () {
      if (!activeTrack) return;
      activeTrack.classList.add("is-playing");
      activeTrack.setAttribute("aria-pressed", "true");
      activeTrack.setAttribute("aria-label", "暂停 " + trackLabel(activeTrack));
      if (listening) listening.classList.add("is-playing");
      if (fullLink) fullLink.href = activeTrack.getAttribute("data-link");
      setPlayerStatus("正在播放 · " + trackLabel(activeTrack));
    });

    audio.addEventListener("pause", function () {
      if (!activeTrack || audio.ended) return;
      resetTrackButton(activeTrack);
      if (listening) listening.classList.remove("is-playing");
      setPlayerStatus("已暂停 · " + trackLabel(activeTrack));
    });

    audio.addEventListener("playing", function () {
      if (!activeTrack) return;
      activeTrack.classList.add("is-playing");
      activeTrack.setAttribute("aria-pressed", "true");
      if (listening) listening.classList.add("is-playing");
      setPlayerStatus("正在播放 · " + trackLabel(activeTrack));
    });

    audio.addEventListener("ended", function () {
      if (!activeTrack) return;
      resetTrackButton(activeTrack);
      if (listening) listening.classList.remove("is-playing");
      setPlayerStatus("试听结束 · " + trackLabel(activeTrack));
    });

    audio.addEventListener("waiting", function () {
      if (!activeTrack || audio.paused) return;
      setPlayerStatus("加载中 · " + trackLabel(activeTrack));
    });

    audio.addEventListener("error", function () {
      if (!activeTrack) return;
      resetTrackButton(activeTrack);
      if (listening) listening.classList.remove("is-playing");
      setPlayerStatus("试听加载失败，可点「完整版」");
    });
  }

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
