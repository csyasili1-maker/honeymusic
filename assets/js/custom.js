(function() {
	"use strict";

	// Preloader
	const preloader = document.getElementById("preloader");
	if (preloader) {
		window.addEventListener("load", () => {
			preloader.classList.add("hidden");
		});
	}

	// Navbar Sticky
	const navbar = document.getElementById("navbar");
    if (navbar) {
		document.addEventListener("DOMContentLoaded", () => {
			const navbar = document.querySelector('#navbar');
			window.addEventListener('scroll', () => {
				if (window.scrollY >= 120) {
					navbar.classList.add('navbar-sticky');
				} else {
					navbar.classList.remove('navbar-sticky');
				}
			});
		});
	}

	// Music Player
	const allPlayers = document.querySelectorAll(".player");
	if (allPlayers.length > 0) {
		const formatTime = (sec) => {
			if (isNaN(sec)) return "0:00";
			const m = Math.floor(sec / 60);
			const s = Math.floor(sec % 60).toString().padStart(2, "0");
			return `${m}:${s}`;
		};
		const setPlayIcon = (icon) => {
			icon.classList.remove("ri-pause-line");
			icon.classList.add("ri-play-fill");
		};
		const setPauseIcon = (icon) => {
			icon.classList.remove("ri-play-fill");
			icon.classList.add("ri-pause-line");
		};
		allPlayers.forEach((player) => {
			const audio = player.querySelector("audio");
			const playPauseBtn = player.querySelector(".playPauseBtn");
			const playPauseIcon = player.querySelector(".playPauseIcon");
			const restartBtn = player.querySelector(".restartBtn");
			const prevBtn = player.querySelector(".rewindBtn");
			const nextBtn = player.querySelector(".fastForwardBtn");
			const loopBtn = player.querySelector(".loopBtn");
			const progressBar = player.querySelector(".progress-bar");
			const progressContainer = player.querySelector(".progress");
			const currentTimeDisplay = player.querySelector(".current-time");
			const durationDisplay = player.querySelector(".duration");

			// Find nearest .track-title before this player
			let titleEl = null;
			let el = player.previousElementSibling;
			while (el && !titleEl) {
				if (el.classList && el.classList.contains("track-title")) {
					titleEl = el;
					break;
				}
				if (el.querySelector) {
					titleEl = el.querySelector(".track-title");
					if (titleEl) break;
				}
				el = el.previousElementSibling;
			}

			// Playlist arrays
			const tracks = (player.dataset.tracks || "")
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			const titles = (player.dataset.titles || "")
				.split(",")
				.map((t) => t.trim());

			let currentTrackIndex = 0;
			const playAudio = () => {
				const promise = audio.play();
				if (promise && typeof promise.then === "function") {
					promise
						.then(() => setPauseIcon(playPauseIcon))
						.catch(() => setPlayIcon(playPauseIcon));
				} else {
					setPauseIcon(playPauseIcon);
				}
			};

			// Load a track
			const loadTrack = (i) => {
				if (!tracks.length) return;
				const total = tracks.length;
				currentTrackIndex = ((i % total) + total) % total; // wrap
				audio.src = tracks[currentTrackIndex];
				audio.currentTime = 0;
				if (titleEl) {
					titleEl.textContent =
						titles[currentTrackIndex] ||
						titles[0] ||
						titleEl.textContent;
				}
				playAudio();
				progressBar.style.width = "0%";
				currentTimeDisplay.textContent = "0:00";

				// Pause other players
				allPlayers.forEach((other) => {
					if (other !== player) {
						const oAudio = other.querySelector("audio");
						const oIcon = other.querySelector(".playPauseIcon");
						oAudio.pause();
						setPlayIcon(oIcon);
					}
				});
			};

			// Display duration
			audio.addEventListener("loadedmetadata", () => {
				durationDisplay.textContent = formatTime(audio.duration);
			});

			// Update progress
			audio.addEventListener("timeupdate", () => {
				currentTimeDisplay.textContent = formatTime(audio.currentTime);
				if (audio.duration) {
					progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
				}
			});

			// Play / Pause
			playPauseBtn.addEventListener("click", () => {
				if (audio.paused) {
					// Pause other players
					allPlayers.forEach((other) => {
						if (other !== player) {
							const oAudio = other.querySelector("audio");
							const oIcon = other.querySelector(".playPauseIcon");
							oAudio.pause();
							setPlayIcon(oIcon);
						}
					});
					playAudio();
				} else {
					audio.pause();
					setPlayIcon(playPauseIcon);
				}
			});

			// Restart
			restartBtn.addEventListener("click", () => {
				audio.currentTime = 0;
				playAudio();
			});

			// Prev track
			prevBtn.addEventListener("click", () => {
				loadTrack(currentTrackIndex - 1);
			});

			// Next track
			nextBtn.addEventListener("click", () => {
				loadTrack(currentTrackIndex + 1);
			});

			// Auto next track when one ends
			audio.addEventListener("ended", () => {
				if (!audio.loop) loadTrack(currentTrackIndex + 1);
			});

			// Loop toggle
			loopBtn.addEventListener("click", () => {
				audio.loop = !audio.loop;
				loopBtn.classList.toggle("text-primary");
			});

			// Seek on progress click
			progressContainer.addEventListener("click", (e) => {
				const rect = progressContainer.getBoundingClientRect();
				const percent = (e.clientX - rect.left) / rect.width;
				audio.currentTime = percent * audio.duration;
			});
		});
	}

	// Menu Toggle Button
	document.addEventListener("DOMContentLoaded", () => {
		const toggles = document.querySelectorAll(".navbar-burger-toggle");
		if (!toggles.length) return;
		const menu = document.querySelector(".sidebar-modal");
		if (!menu) return;
		const backdrop = document.querySelector(".backdrop");
		if (!backdrop) return;
		const closeBtn = menu.querySelector("button");
		const openMenu = () => {
			if (!menu || !backdrop) return;
			menu.classList.add("show");
			backdrop.classList.add("show");
		};
		const closeMenu = () => {
			if (!menu || !backdrop) return;
			menu.classList.remove("show");
			backdrop.classList.remove("show");
		};
		toggles.forEach(btn => {
			if (!btn) return;
			btn.addEventListener("click", openMenu);
		});
		if (closeBtn) closeBtn.addEventListener("click", closeMenu);
		if (backdrop) backdrop.addEventListener("click", closeMenu);
	});

	// ScrollCue
	if (typeof scrollCue !== "undefined") {
		scrollCue.init();
	}

	// Swiper Slider
	if (typeof Swiper !== "undefined") {

		// Videos Slider
		var swiper = new Swiper(".videosSwiperThumbs", {
			loop: true,
			freeMode: true,
			slidesPerView: 1,
			watchSlidesProgress: true,
			breakpoints: {
				768: {
					slidesPerView: 2
				},
				1280: {
					slidesPerView: 3
				}
			}
		});
		var swiper = new Swiper(".videosSwiper", {
			loop: true,
			effect: "fade",
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			thumbs: {
				swiper: swiper
			}
		});

		// Tours Slider
		var swiper = new Swiper(".toursSwiper", {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 25,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			breakpoints: {
				640: {
					slidesPerView: 2
				},
				1024: {
					slidesPerView: 3
				}
			}
		});

		// Testimonials Slider
		var swiper = new Swiper(".testimonialsSwiper", {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 25,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			navigation: {
				nextEl: ".testimonials-button-next",
				prevEl: ".testimonials-button-prev"
			}
		});

		// Playlist Slider
		var swiper = new Swiper(".playlistSwiper", {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 25,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			navigation: {
				nextEl: ".testimonials-button-next",
				prevEl: ".testimonials-button-prev"
			},
			breakpoints: {
				640: {
					slidesPerView: 2
				},
				1280: {
					slidesPerView: 3
				}
			}
		});

	}

	// Counter
	if ("IntersectionObserver" in window) {
        let counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                let counter = entry.target;
                let target = parseInt(counter.innerText, 10);
                let step = target / 200;
                let current = 0;
                let timer = setInterval(function () {
                    current += step;
                    counter.innerText = Math.floor(current);
                    if (parseInt(counter.innerText, 10) >= target) {
                    clearInterval(timer);
                    }
                }, 10);
                counterObserver.unobserve(counter);
                }
            });
        });
        let counters = document.querySelectorAll(".counter");
            counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

	// Quantity Counter
	document.querySelectorAll(".qty-counter-input").forEach(counter => {
		const input = counter.querySelector("input[type='number']");
		const minusBtn = counter.querySelector(".qty-minus");
		const plusBtn = counter.querySelector(".qty-plus");
		plusBtn.addEventListener("click", () => {
			const current = parseInt(input.value, 10) || 0;
			input.value = current + 1;
		});
		minusBtn.addEventListener("click", () => {
			const min = parseInt(input.min, 10) || 0;
			const current = parseInt(input.value, 10) || 0;
			if (current > min) {
				input.value = current - 1;
			}
		});
	});

	// Accordion
	const accordion = document.getElementById("accordion");
	if (accordion) {
		const items = accordion.querySelectorAll(".accordion-item");
		items.forEach(item => {
			const toggle = item.querySelector(".accordion-toggle");
			toggle.addEventListener("click", () => {
				// Close all items
				items.forEach(i => {
					i.classList.remove("active");
					i.querySelector(".accordion-panel").classList.add("hidden");
				});
				// Open the clicked item
				item.classList.add("active");
				item.querySelector(".accordion-panel").classList.remove("hidden");
			});
		});
	}

	// Tabs
	document.querySelectorAll(".tabs").forEach((tabsBlock) => {
		const navLinks = tabsBlock.querySelectorAll(".nav-link");
		const tabPanes = tabsBlock.querySelectorAll(".tab-pane");
		navLinks.forEach((btn, index) => {
			btn.addEventListener("click", () => {
				// Remove active from current tab group only
				navLinks.forEach(link => link.classList.remove("active"));
				tabPanes.forEach(pane => pane.classList.remove("active"));
				// Activate clicked tab + its pane
				btn.classList.add("active");
				tabPanes[index].classList.add("active");
			});
		});
	});

	// Dark/Light Toggle
	const switchToggle = document.getElementById('lightDarkToggle');
	if (switchToggle) {
		const body = document.body;
		const icon = switchToggle.querySelector("i");

		// Always start in dark mode unless user previously selected light
		let savedTheme = localStorage.getItem("honey_music_theme");

		if (savedTheme === "light") {
			body.classList.add("light");
			icon.className = "ri-moon-fill";
		} else {
			// Default = dark mode
			body.classList.add("dark");
			localStorage.setItem("honey_music_theme", "dark");
			icon.className = "ri-sun-fill";
		}

		// Toggle on click
		switchToggle.addEventListener("click", () => {
			if (body.classList.contains("dark")) {
				// Switch to light
				body.classList.remove("dark");
				body.classList.add("light");
				localStorage.setItem("honey_music_theme", "light");
				icon.className = "ri-moon-fill"; // moon = light mode
			} else {
				// Switch back to dark
				body.classList.remove("light");
				body.classList.add("dark");
				localStorage.setItem("honey_music_theme", "dark");
				icon.className = "ri-sun-fill"; // sun = dark mode
			}
		});
	}

	// LTR/RTL Toggle
	const rtlToggleBtn = document.getElementById("ltrRtlToggle");
	if (rtlToggleBtn) {
		const htmlTag = document.documentElement;
		const icon = rtlToggleBtn.querySelector("i");
		// Load direction from storage
		const savedDirection = localStorage.getItem("textDirection") || "ltr";
		htmlTag.setAttribute("dir", savedDirection);
		// Set correct icon on load
		if (savedDirection === "rtl") {
			icon.className = "ri-english-input";
		} else {
			icon.className = "ri-translate";
		}
		// Toggle direction on click
		rtlToggleBtn.addEventListener("click", () => {
			const current = htmlTag.getAttribute("dir");
			const newDir = current === "ltr" ? "rtl" : "ltr";
			// Update direction
			htmlTag.setAttribute("dir", newDir);
			localStorage.setItem("textDirection", newDir);
			// Swap icon
			if (newDir === "rtl") {
				icon.className = "ri-english-input"; // RTL icon
			} else {
				icon.className = "ri-translate"; // LTR icon
			}
		});
	}

	// Back to Top
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        const backToTopBtn = document.getElementById("backToTopBtn");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
})();

// Sidebar Navbar Menu
const sidebar = document.querySelector('.sidebar-navbar-nav');
if (sidebar) {
    const list = sidebar.querySelectorAll('.nav-item');
    function accordion(e) {
        e.stopPropagation();
        if (this.classList.contains('active')) {
            this.classList.remove('active');
        } else if (this.parentElement.parentElement.classList.contains('active')) {
            this.classList.add('active');
        } else {
            for (let i = 0; i < list.length; i++) {
                list[i].classList.remove('active');
            }
            this.classList.add('active');
        }
    }
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', accordion);
    }
}
