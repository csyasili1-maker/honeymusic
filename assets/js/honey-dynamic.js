(function () {
    "use strict";

    const dataUrl = "assets/data/honey-music.json";
    const storageKey = "honeyMusicData";

    function getStoredData() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "null");
        } catch (error) {
            return null;
        }
    }

    async function loadHoneyData() {
        const stored = getStoredData();
        if (stored) return stored;
        try {
            const response = await fetch(dataUrl, { cache: "no-store" });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    function enhancePlayers() {
        document.querySelectorAll(".player").forEach((player) => {
            const audio = player.querySelector("audio");
            if (!audio) return;

            audio.addEventListener("play", () => {
                document.querySelectorAll(".player.is-playing").forEach((item) => {
                    if (item !== player) item.classList.remove("is-playing");
                });
                player.classList.add("is-playing");
            });

            ["pause", "ended"].forEach((eventName) => {
                audio.addEventListener(eventName, () => player.classList.remove("is-playing"));
            });

            if (player.querySelector(".honey-volume-control")) return;

            const wrap = document.createElement("div");
            wrap.className = "honey-volume-control";

            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("aria-label", "Mute audio");
            button.innerHTML = '<i class="ri-volume-up-line"></i>';

            const range = document.createElement("input");
            range.type = "range";
            range.min = "0";
            range.max = "1";
            range.step = "0.01";
            range.value = String(audio.volume || 1);
            range.setAttribute("aria-label", "Audio volume");

            button.addEventListener("click", () => {
                audio.muted = !audio.muted;
                button.innerHTML = audio.muted ? '<i class="ri-volume-mute-line"></i>' : '<i class="ri-volume-up-line"></i>';
            });

            range.addEventListener("input", () => {
                audio.volume = Number(range.value);
                audio.muted = audio.volume === 0;
                button.innerHTML = audio.muted ? '<i class="ri-volume-mute-line"></i>' : '<i class="ri-volume-up-line"></i>';
            });

            wrap.append(button, range);
            player.appendChild(wrap);
        });
    }

    function exposeData(data) {
        if (!data) return;
        window.HONEY_MUSIC_DATA = data;
        document.dispatchEvent(new CustomEvent("honeyMusicDataReady", { detail: data }));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", enhancePlayers);
    } else {
        enhancePlayers();
    }

    loadHoneyData().then(exposeData);
})();
