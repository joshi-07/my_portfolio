// Floating tech cluster for the refreshed hero.
(function () {
    const icons = [
        { icon: "fa-html5", color: "#e86b3d", x: "22%", y: "20%", z: "44px", size: "58px", speed: "5.6s" },
        { icon: "fa-css3-alt", color: "#4fa3ff", x: "68%", y: "18%", z: "26px", size: "50px", speed: "6.4s" },
        { icon: "fa-js-square", color: "#c7a86b", x: "82%", y: "46%", z: "64px", size: "62px", speed: "5.2s" },
        { icon: "fa-react", color: "#55b9b3", x: "55%", y: "55%", z: "92px", size: "72px", speed: "7s" },
        { icon: "fa-node-js", color: "#86b99b", x: "21%", y: "58%", z: "34px", size: "56px", speed: "5.8s" },
        { icon: "fa-python", color: "#8d98aa", x: "48%", y: "82%", z: "58px", size: "58px", speed: "6.7s" },
        { icon: "fa-git-alt", color: "#9f8588", x: "13%", y: "39%", z: "16px", size: "46px", speed: "5.5s" },
        { icon: "fa-database", color: "#f1f7a2", x: "75%", y: "75%", z: "22px", size: "48px", speed: "6.2s" }
    ];

    function initOrbitingIcons() {
        const container = document.getElementById("floating-icons-3d");
        if (!container) return;

        container.innerHTML = "";
        const orbit = document.createElement("div");
        orbit.className = "tech-orbit";
        container.appendChild(orbit);

        icons.forEach((item, index) => {
            const tile = document.createElement("div");
            tile.className = "floating-icon";
            tile.style.setProperty("--x", item.x);
            tile.style.setProperty("--y", item.y);
            tile.style.setProperty("--z", item.z);
            tile.style.setProperty("--size", item.size);
            tile.style.setProperty("--speed", item.speed);
            tile.style.setProperty("--delay", `${index * -0.34}s`);
            tile.style.setProperty("--r", `${index % 2 === 0 ? -6 : 6}deg`);
            tile.style.setProperty("--icon-color", item.color);
            tile.setAttribute("aria-hidden", "true");
            tile.innerHTML = `<i class="fab ${item.icon}"></i>`;
            orbit.appendChild(tile);
        });
    }

    function initHeroTitleTilt() {
        const title = document.getElementById("hero-title");
        if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        title.addEventListener("pointermove", (event) => {
            const rect = title.getBoundingClientRect();
            const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
            const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
            title.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
        });

        title.addEventListener("pointerleave", () => {
            title.style.transform = "";
        });
    }

    function triggerGlitch() {
        const layer = document.querySelector(".rgb-glitch");
        if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        layer.classList.add("is-active");
        window.setTimeout(() => layer.classList.remove("is-active"), 320);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            initOrbitingIcons();
            initHeroTitleTilt();
            window.setInterval(triggerGlitch, 6500);
        }, { once: true });
    } else {
        initOrbitingIcons();
        initHeroTitleTilt();
        window.setInterval(triggerGlitch, 6500);
    }

    window.addEventListener("resize", () => {
        window.clearTimeout(window.__portfolioIconResize);
        window.__portfolioIconResize = window.setTimeout(initOrbitingIcons, 180);
    }, { passive: true });
})();
