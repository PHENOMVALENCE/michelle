/* Michelle Mugo portfolio — navigation, motion, and micro-interactions */
(function ($) {
	"use strict";

	function syncNavBarOffset() {
		var nav = document.getElementById("mainNav");
		if (!nav || !nav.getBoundingClientRect) {
			return;
		}
		var h = Math.ceil(nav.getBoundingClientRect().height);
		if (h > 0) {
			document.documentElement.style.setProperty("--mm-nav-offset", h + "px");
		}
	}

	function getNavScrollOffset() {
		var raw = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue("--mm-nav-offset")
			.trim();
		var n = parseFloat(raw);
		if (window.isNaN(n) || n <= 0) {
			n = $(window).width() < 992 ? 62 : 74;
		}
		return Math.round(n + 6);
	}

	function setMenuOpen(open) {
		var $panel = $(".offcanvas-collapse");
		var $backdrop = $("#mmNavBackdrop");
		var $toggle = $('[data-toggle="offcanvas"]');
		if (!$panel.length) {
			return;
		}
		if (open) {
			syncNavBarOffset();
			$panel.addClass("open");
			$("body").addClass("mm-nav-open");
			$backdrop.addClass("is-visible");
			$toggle.attr("aria-expanded", "true");
			$panel.attr("aria-modal", "true");
		} else {
			$panel.removeClass("open");
			$("body").removeClass("mm-nav-open");
			$backdrop.removeClass("is-visible");
			$toggle.attr("aria-expanded", "false");
			$panel.attr("aria-modal", "false");
		}
	}

	function setNavbarMode() {
		var scrolled = $(window).scrollTop() > 48;
		var $nav = $(".mm-navbar");
		if (scrolled) {
			$nav.addClass("top-nav-collapse navbar-light").removeClass("navbar-dark");
		} else {
			$nav.removeClass("top-nav-collapse navbar-light").addClass("navbar-dark");
		}
	}

	$(window).on("scroll", function () {
		setNavbarMode();
	});

	$(window).on("load resize orientationchange", function () {
		syncNavBarOffset();
		setNavbarMode();
		if ($(window).width() >= 992) {
			setMenuOpen(false);
		}
	});

	$(function () {
		syncNavBarOffset();
		setNavbarMode();

		$(document).on("click", "a.page-scroll", function (event) {
			var href = $(this).attr("href");
			if (!href || href.indexOf("#") !== 0) {
				return;
			}
			var $target = $(href);
			if (!$target.length) {
				return;
			}
			$("html, body").stop().animate(
				{
					scrollTop: $target.offset().top - getNavScrollOffset(),
				},
				700,
				"easeInOutExpo"
			);
			event.preventDefault();
		});
	});

	$('[data-toggle="offcanvas"]').on("click", function () {
		if ($(window).width() >= 992) {
			return;
		}
		var open = !$(".offcanvas-collapse").hasClass("open");
		setMenuOpen(open);
	});

	$("#mmNavBackdrop").on("click", function () {
		setMenuOpen(false);
	});

	$(document).on("keydown.mmNav", function (e) {
		if (e.key === "Escape" && $("body").hasClass("mm-nav-open")) {
			setMenuOpen(false);
		}
	});

	$(".navbar-nav .page-scroll").on("click", function () {
		setMenuOpen(false);
	});

	$("input, textarea").on("keyup change", function () {
		$(this).toggleClass("notEmpty", $(this).val() !== "");
	});

	$("body").prepend(
		'<a href="#hero" class="back-to-top page-scroll" aria-label="Back to top"><i class="fas fa-chevron-up" aria-hidden="true"></i></a>'
	);
	$(window).on("scroll", function () {
		if ($(window).scrollTop() > 480) {
			$("a.back-to-top").fadeIn(300);
		} else {
			$("a.back-to-top").fadeOut(300);
		}
	});

	$(".button, a, button").mouseup(function () {
		$(this).blur();
	});

	var sectionSelector = "main section[id], header[id]";
	function updateActiveNav() {
		var scrollPos = $(window).scrollTop() + getNavScrollOffset() + 32;
		var current = null;
		$(sectionSelector).each(function () {
			var $sec = $(this);
			if ($sec.offset().top <= scrollPos) {
				current = $sec.attr("id");
			}
		});
		if (!current) {
			current = "hero";
		}
		/* Sections without nav links: keep parent section highlighted */
		if (current === "languages") {
			current = "skills";
		}
		$(".mm-nav-link").removeClass("active");
		$('.mm-nav-link[href="#' + current + '"]').addClass("active");
	}
	$(window).on("scroll", updateActiveNav);
	updateActiveNav();
})(jQuery);

(function () {
	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var mqCoarse = window.matchMedia("(max-width: 991px), (hover: none)").matches;

	function initStaggerDelays() {
		document.querySelectorAll(".mm-stagger").forEach(function (group) {
			var kids = group.querySelectorAll(
				":scope > .mm-reveal, :scope > article.mm-reveal"
			);
			kids.forEach(function (el, i) {
				el.style.setProperty("--mm-reveal-delay", i * 72 + "ms");
			});
		});
	}

	function initScrollProgress() {
		var bar = document.querySelector(".mm-scroll-progress-bar");
		if (!bar) {
			return;
		}
		function tick() {
			var root = document.documentElement;
			var scrollTop = root.scrollTop || document.body.scrollTop;
			var max = root.scrollHeight - root.clientHeight;
			var pct = max > 0 ? (scrollTop / max) * 100 : 0;
			bar.style.width = pct + "%";
		}
		window.addEventListener("scroll", tick, { passive: true });
		tick();
	}

	function initHeroParallax() {
		if (reduceMotion) {
			return;
		}
		var heroBg = document.querySelector(".mm-js-hero-parallax");
		if (!heroBg) {
			return;
		}
		var ticking = false;
		function update() {
			ticking = false;
			var y = window.scrollY * 0.22;
			heroBg.style.transform =
				"translate3d(0," + Math.min(y, 140) + "px,0) scale(1.02)";
		}
		window.addEventListener(
			"scroll",
			function () {
				if (!ticking) {
					ticking = true;
					requestAnimationFrame(update);
				}
			},
			{ passive: true }
		);
		update();
	}

	function bindTilt(el, maxDeg) {
		maxDeg = maxDeg || 5;
		el.addEventListener("mousemove", function (e) {
			var r = el.getBoundingClientRect();
			var x = e.clientX - r.left;
			var y = e.clientY - r.top;
			var midX = r.width / 2;
			var midY = r.height / 2;
			var rotY = ((x - midX) / midX) * -maxDeg;
			var rotX = ((midY - y) / midY) * maxDeg;
			el.style.transform =
				"perspective(960px) rotateX(" +
				rotX +
				"deg) rotateY(" +
				rotY +
				"deg) translateY(-4px)";
		});
		el.addEventListener("mouseleave", function () {
			el.style.transform = "";
		});
	}

	function initCardTilt() {
		if (reduceMotion || mqCoarse) {
			return;
		}
		document.querySelectorAll(".mm-js-tilt-card").forEach(function (el) {
			bindTilt(el, 5);
		});
	}

	function initProfileTilt() {
		if (reduceMotion || mqCoarse) {
			return;
		}
		document.querySelectorAll(".mm-js-tilt").forEach(function (wrap) {
			var frame = wrap.querySelector(".mm-profile-frame");
			if (!frame) {
				return;
			}
			wrap.addEventListener("mousemove", function (e) {
				var r = wrap.getBoundingClientRect();
				var x = e.clientX - r.left;
				var y = e.clientY - r.top;
				var midX = r.width / 2;
				var midY = r.height / 2;
				var rotY = ((x - midX) / midX) * -6;
				var rotX = ((midY - y) / midY) * 6;
				frame.style.transform =
					"perspective(900px) rotateX(" +
					rotX +
					"deg) rotateY(" +
					rotY +
					"deg)";
			});
			wrap.addEventListener("mouseleave", function () {
				frame.style.transform = "";
			});
		});
	}

	function initRipples() {
		if (reduceMotion) {
			return;
		}
		document
			.querySelectorAll(".mm-btn-solid, .mm-btn-outline, .mm-btn-whatsapp")
			.forEach(function (btn) {
				btn.addEventListener("click", function (e) {
					var rect = btn.getBoundingClientRect();
					var size = Math.max(rect.width, rect.height) * 2.2;
					var ripple = document.createElement("span");
					ripple.className = "mm-ripple";
					ripple.style.width = ripple.style.height = size + "px";
					ripple.style.left = e.clientX - rect.left - size / 2 + "px";
					ripple.style.top = e.clientY - rect.top - size / 2 + "px";
					btn.appendChild(ripple);
					window.setTimeout(function () {
						ripple.remove();
					}, 700);
				});
			});
	}

	function boot() {
		initStaggerDelays();
		initScrollProgress();
		initHeroParallax();
		initCardTilt();
		initProfileTilt();
		initRipples();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();

/* Reveal on scroll + animated counters */
(function () {
	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function initReveal() {
		var els = document.querySelectorAll(".mm-reveal");
		if (!els.length) {
			return;
		}
		if (!("IntersectionObserver" in window) || reduceMotion) {
			els.forEach(function (el) {
				el.classList.add("mm-reveal-visible");
			});
			return;
		}
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("mm-reveal-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
		);
		els.forEach(function (el) {
			io.observe(el);
		});
	}

	function formatStat(el, value) {
		var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
		var suffix = el.getAttribute("data-suffix") || "";
		if (decimals > 0) {
			return value.toFixed(decimals) + suffix;
		}
		var rounded = Math.round(value);
		var formatted =
			rounded >= 1000 ? rounded.toLocaleString("en-US") : String(rounded);
		return formatted + suffix;
	}

	function animateCounter(el) {
		var target = parseFloat(el.getAttribute("data-target"), 10);
		if (isNaN(target)) {
			return;
		}
		if (reduceMotion) {
			el.textContent = formatStat(el, target);
			return;
		}
		var duration = 2000;
		var start = performance.now();
		var from = 0;

		function frame(now) {
			var t = Math.min((now - start) / duration, 1);
			var eased = 1 - Math.pow(1 - t, 3);
			var value = from + (target - from) * eased;
			el.textContent = formatStat(el, value);
			if (t < 1) {
				requestAnimationFrame(frame);
			} else {
				el.textContent = formatStat(el, target);
			}
		}
		requestAnimationFrame(frame);
	}

	function initCounters() {
		var counters = document.querySelectorAll("#impact .counter");
		if (!counters.length) {
			return;
		}
		if (!("IntersectionObserver" in window)) {
			counters.forEach(function (c) {
				animateCounter(c);
			});
			return;
		}
		var fired = false;
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting && !fired) {
						fired = true;
						counters.forEach(function (c) {
							animateCounter(c);
						});
						io.disconnect();
					}
				});
			},
			{ threshold: 0.2 }
		);
		var impact = document.getElementById("impact");
		if (impact) {
			io.observe(impact);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			initReveal();
			initCounters();
		});
	} else {
		initReveal();
		initCounters();
	}
})();
