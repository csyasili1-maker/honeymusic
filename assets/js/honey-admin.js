(function () {
    "use strict";

    const dataUrl = "assets/data/honey-music.json";
    const storageKey = "honeyMusicData";
    const form = document.querySelector("[data-admin-form]");
    const textarea = document.querySelector("[data-admin-json]");
    const status = document.querySelector("[data-admin-status]");
    const reset = document.querySelector("[data-admin-reset]");

    function setStatus(message) {
        if (status) status.textContent = message;
    }

    async function loadData() {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
        const response = await fetch(dataUrl, { cache: "no-store" });
        return response.json();
    }

    loadData()
        .then((data) => {
            textarea.value = JSON.stringify(data, null, 2);
            setStatus("Content ready");
        })
        .catch(() => setStatus("Could not load content"));

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
            const parsed = JSON.parse(textarea.value);
            localStorage.setItem(storageKey, JSON.stringify(parsed));
            setStatus("Saved locally. Refresh the website to see updates.");
        } catch (error) {
            setStatus("JSON is not valid.");
        }
    });

    reset.addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        window.location.reload();
    });
})();
