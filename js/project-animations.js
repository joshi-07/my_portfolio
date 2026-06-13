// Interactive project lab built from the existing project cards and links.
(function () {
    function text(node) {
        return node ? node.textContent.trim() : "";
    }

    function getImageSource(img) {
        return img ? (img.currentSrc || img.src || img.dataset.src || "") : "";
    }

    function collectProject(card, index) {
        const title = text(card.querySelector(".project-title")) || `Project ${index + 1}`;
        const description = text(card.querySelector(".project-description"));
        const tech = Array.from(card.querySelectorAll(".tech-tag")).map(text).filter(Boolean);
        const image = getImageSource(card.querySelector(".project-screenshot"));
        const links = Array.from(card.querySelectorAll("a[href]")).map((link) => ({
            href: link.getAttribute("href"),
            label: text(link) || link.getAttribute("aria-label") || "Open"
        }));

        card.dataset.projectIndex = String(index);
        card.dataset.projectTitle = title.toLowerCase();
        card.dataset.projectDescription = description.toLowerCase();
        card.dataset.projectTech = tech.join(" ").toLowerCase();

        return { card, index, title, description, tech, image, links };
    }

    function createProjectLab(projects) {
        const firstGrid = document.querySelector(".projects-section .projects-grid");
        if (!firstGrid || document.querySelector(".project-lab")) return null;

        const uniqueTech = Array.from(new Set(projects.flatMap((project) => project.tech))).slice(0, 11);

        const lab = document.createElement("div");
        lab.className = "project-lab";
        lab.innerHTML = `
            <div class="project-lab-main">
                <canvas class="project-lab-canvas" aria-hidden="true"></canvas>
                <div class="project-lab-copy">
                    <div class="project-lab-kicker">${projects.length} projects online</div>
                    <h3 class="project-lab-title"></h3>
                    <p class="project-lab-desc"></p>
                </div>
            </div>
            <div class="project-controls">
                <input class="project-search" type="search" aria-label="Search projects" placeholder="Search projects">
                <div class="filter-row" aria-label="Project filters"></div>
                <div class="project-counter" aria-live="polite"></div>
            </div>
        `;

        const row = lab.querySelector(".filter-row");
        const chips = ["All", ...uniqueTech].map((label) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "filter-chip";
            button.textContent = label;
            button.dataset.filter = label.toLowerCase();
            row.appendChild(button);
            return button;
        });

        chips[0].classList.add("is-active");
        firstGrid.parentNode.insertBefore(lab, firstGrid);
        return lab;
    }

    function createProjectModal() {
        let modal = document.getElementById("project-modal");
        if (modal) return modal;

        modal = document.createElement("div");
        modal.id = "project-modal";
        modal.className = "project-modal";
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = `
            <div class="project-modal-backdrop" data-close="project-modal"></div>
            <div class="project-modal-content" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
                <div class="project-modal-header">
                    <h3 class="project-modal-title" id="project-modal-title"></h3>
                    <button class="project-modal-close" type="button" data-close="project-modal" aria-label="Close project details">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="project-modal-body">
                    <img class="project-modal-image" alt="">
                    <div class="project-modal-side">
                        <p class="project-modal-description"></p>
                        <div class="project-modal-tech"></div>
                        <div class="project-modal-links"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function initProjectLab() {
        const cards = Array.from(document.querySelectorAll(".project-card"));
        if (!cards.length) return;

        const projects = cards.map(collectProject);
        const lab = createProjectLab(projects);
        const modal = createProjectModal();
        const title = lab ? lab.querySelector(".project-lab-title") : null;
        const desc = lab ? lab.querySelector(".project-lab-desc") : null;
        const kicker = lab ? lab.querySelector(".project-lab-kicker") : null;
        const search = lab ? lab.querySelector(".project-search") : null;
        const counter = lab ? lab.querySelector(".project-counter") : null;
        const chips = lab ? Array.from(lab.querySelectorAll(".filter-chip")) : [];
        const canvas = lab ? lab.querySelector(".project-lab-canvas") : null;
        let activeFilter = "all";
        let activeIndex = 0;

        function setActiveProject(index) {
            const project = projects[index] || projects[0];
            if (!project) return;

            activeIndex = project.index;
            projects.forEach((item) => item.card.classList.toggle("is-active", item.index === project.index));
            if (title) title.textContent = project.title;
            if (desc) desc.textContent = project.description;
            if (kicker) kicker.textContent = `${project.tech.slice(0, 3).join(" / ") || "Project"} stack`;
        }

        function projectMatches(project, query) {
            const haystack = `${project.title} ${project.description} ${project.tech.join(" ")}`.toLowerCase();
            const filterMatch = activeFilter === "all" || project.tech.some((item) => item.toLowerCase() === activeFilter);
            const queryMatch = !query || haystack.includes(query);
            return filterMatch && queryMatch;
        }

        function applyFilters() {
            const query = search ? search.value.trim().toLowerCase() : "";
            let visible = 0;
            let firstVisible = null;

            projects.forEach((project) => {
                const match = projectMatches(project, query);
                project.card.classList.toggle("is-filtered-out", !match);
                if (match) {
                    visible += 1;
                    if (firstVisible === null) firstVisible = project.index;
                }
            });

            if (counter) {
                counter.textContent = `${visible} / ${projects.length} visible`;
            }

            if (firstVisible !== null && projects[activeIndex] && !projectMatches(projects[activeIndex], query)) {
                setActiveProject(firstVisible);
            }
        }

        function openModal(project) {
            const modalTitle = modal.querySelector(".project-modal-title");
            const modalImage = modal.querySelector(".project-modal-image");
            const modalDescription = modal.querySelector(".project-modal-description");
            const modalTech = modal.querySelector(".project-modal-tech");
            const modalLinks = modal.querySelector(".project-modal-links");

            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalImage.src = project.image;
            modalImage.alt = `${project.title} preview`;

            modalTech.innerHTML = "";
            project.tech.forEach((item) => {
                const chip = document.createElement("span");
                chip.className = "tech-tag";
                chip.textContent = item;
                modalTech.appendChild(chip);
            });

            modalLinks.innerHTML = "";
            const sourceLinks = Array.from(project.card.querySelectorAll("a[href]"));
            sourceLinks.forEach((source, index) => {
                const clone = source.cloneNode(true);
                clone.className = "project-btn";
                if (!text(clone)) {
                    clone.textContent = index === 0 ? "Open Link" : "View";
                }
                modalLinks.appendChild(clone);
            });

            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        function initTilt(card) {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            card.addEventListener("pointermove", (event) => {
                if (event.pointerType === "touch") return;
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const px = x / Math.max(rect.width, 1);
                const py = y / Math.max(rect.height, 1);
                const rotateY = (px - 0.5) * 12;
                const rotateX = (0.5 - py) * 10;
                card.style.setProperty("--mx", `${px * 100}%`);
                card.style.setProperty("--my", `${py * 100}%`);
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        }

        function initCanvas() {
            if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const nodes = Array.from({ length: 24 }, (_, index) => ({
                x: Math.random(),
                y: Math.random(),
                vx: (Math.random() - 0.5) * 0.0015,
                vy: (Math.random() - 0.5) * 0.0015,
                color: ["#55b9b3", "#77909c", "#c7a86b", "#8d98aa", "#86b99b"][index % 5]
            }));

            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.max(1, Math.floor(rect.width * ratio));
                canvas.height = Math.max(1, Math.floor(rect.height * ratio));
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            }

            function draw() {
                const rect = canvas.getBoundingClientRect();
                ctx.clearRect(0, 0, rect.width, rect.height);
                ctx.lineWidth = 1;

                nodes.forEach((node) => {
                    node.x += node.vx;
                    node.y += node.vy;
                    if (node.x < 0.03 || node.x > 0.97) node.vx *= -1;
                    if (node.y < 0.06 || node.y > 0.94) node.vy *= -1;
                });

                nodes.forEach((a, i) => {
                    for (let j = i + 1; j < nodes.length; j += 1) {
                        const b = nodes[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 0.24) {
                            ctx.globalAlpha = (0.24 - distance) * 1.8;
                            ctx.strokeStyle = a.color;
                            ctx.beginPath();
                            ctx.moveTo(a.x * rect.width, a.y * rect.height);
                            ctx.lineTo(b.x * rect.width, b.y * rect.height);
                            ctx.stroke();
                        }
                    }
                });

                nodes.forEach((node, index) => {
                    const size = index === activeIndex % nodes.length ? 5 : 3;
                    ctx.globalAlpha = index === activeIndex % nodes.length ? 0.95 : 0.58;
                    ctx.fillStyle = node.color;
                    ctx.fillRect(node.x * rect.width - size / 2, node.y * rect.height - size / 2, size, size);
                });

                ctx.globalAlpha = 1;
                requestAnimationFrame(draw);
            }

            resizeCanvas();
            draw();
            window.addEventListener("resize", resizeCanvas, { passive: true });
        }

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                activeFilter = chip.dataset.filter || "all";
                chips.forEach((item) => item.classList.toggle("is-active", item === chip));
                applyFilters();
            });
        });

        if (search) {
            search.addEventListener("input", applyFilters);
        }

        projects.forEach((project) => {
            const { card } = project;
            card.tabIndex = 0;
            initTilt(card);

            card.addEventListener("mouseenter", () => setActiveProject(project.index));
            card.addEventListener("focusin", () => setActiveProject(project.index));
            card.addEventListener("click", (event) => {
                if (event.target.closest("a, button")) return;
                openModal(project);
            });
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(project);
                }
            });
        });

        modal.addEventListener("click", (event) => {
            if (event.target.closest("[data-close='project-modal']")) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("open")) {
                closeModal();
            }
        });

        setActiveProject(0);
        applyFilters();
        initCanvas();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProjectLab, { once: true });
    } else {
        initProjectLab();
    }
})();
