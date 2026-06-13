// Refreshed portfolio interactions.
(function () {
    const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const cleanText = (node) => (node ? node.textContent.trim().replace(/\s+/g, " ") : "");

    document.addEventListener("DOMContentLoaded", () => {
        setupMobileNav();
        setupTheme();
        setupSmoothScroll();
        setupProgress();
        setupReveal();
        setupSkillBars();
        setupCounters();
        setupLazyImages();
        setupCursorTrail();
        setupTooltips();
        setupContactForm();
        setupBackToTop();
        setupChatbot();
    });

    function setupMobileNav() {
        const toggle = $(".mobile-menu-toggle");
        const menu = $(".nav-menu");
        if (!toggle || !menu) return;

        function closeMenu() {
            toggle.classList.remove("active");
            menu.classList.remove("open");
            document.body.classList.remove("menu-open");
            toggle.setAttribute("aria-expanded", "false");
        }

        function openMenu() {
            toggle.classList.add("active");
            menu.classList.add("open");
            document.body.classList.add("menu-open");
            toggle.setAttribute("aria-expanded", "true");
        }

        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", () => {
            if (menu.classList.contains("open")) closeMenu();
            else openMenu();
        });

        $$(".nav-link", menu).forEach((link) => link.addEventListener("click", closeMenu));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
        document.addEventListener("click", (event) => {
            if (!menu.classList.contains("open")) return;
            if (event.target.closest(".nav-container")) return;
            closeMenu();
        });
    }

    function setupTheme() {
        const button = $("#theme-toggle");
        if (!button) return;

        const icon = $("i", button);
        const savedTheme = localStorage.getItem("theme") || "dark";

        function applyTheme(theme) {
            const light = theme === "light";
            document.body.classList.toggle("light-mode", light);
            if (icon) {
                icon.classList.toggle("fa-moon", !light);
                icon.classList.toggle("fa-sun", light);
            }
            localStorage.setItem("theme", theme);
        }

        applyTheme(savedTheme);
        button.addEventListener("click", () => {
            applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
        });
    }

    function setupSmoothScroll() {
        let lenis = null;
        if (window.Lenis && !prefersReducedMotion()) {
            lenis = new Lenis({
                smooth: true,
                lerp: 0.09,
                wheelMultiplier: 1,
                touchMultiplier: 1.05
            });

            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        }

        function scrollToId(id) {
            const target = document.getElementById(id);
            if (!target) return;
            const nav = $(".navbar");
            const offset = nav ? nav.offsetHeight + 30 : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            if (lenis) {
                lenis.scrollTo(top, { duration: 1.05 });
            } else {
                window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
            }
        }

        $$("a[href^='#']").forEach((anchor) => {
            anchor.addEventListener("click", (event) => {
                const href = anchor.getAttribute("href");
                if (!href || href === "#") return;
                const id = href.slice(1);
                if (!document.getElementById(id)) return;
                event.preventDefault();
                scrollToId(id);
            });
        });

        window.__portfolioScrollTo = scrollToId;
    }

    function setupProgress() {
        const fill = $(".progress-fill");
        const dots = $$(".progress-dot");
        const links = $$(".nav-link");
        const sections = $$("section[id]");
        if (!fill || !sections.length) return;

        let ticking = false;

        function update() {
            const doc = document.documentElement;
            const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
            const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
            fill.style.width = `${pct}%`;

            const midpoint = window.scrollY + window.innerHeight * 0.42;
            let current = sections[0].id;

            sections.forEach((section) => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (midpoint >= top && midpoint < bottom) current = section.id;
            });

            dots.forEach((dot) => dot.classList.toggle("active", dot.dataset.section === current));
            links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
            ticking = false;
        }

        function requestUpdate() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }

        dots.forEach((dot) => {
            dot.addEventListener("click", () => {
                if (window.__portfolioScrollTo && dot.dataset.section) {
                    window.__portfolioScrollTo(dot.dataset.section);
                }
            });
        });

        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate, { passive: true });
        update();
    }

    function setupReveal() {
        const elements = [
            ...$$(".section-header"),
            ...$$(".about-content"),
            ...$$(".timeline-item"),
            ...$$(".skill-category"),
            ...$$(".project-lab"),
            ...$$(".contact-content"),
            ...$$(".stats-recap-content"),
            ...$$(".footer-content")
        ];

        if (!elements.length) return;

        if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        elements.forEach((element) => element.classList.add("reveal-ready"));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

        elements.forEach((element) => observer.observe(element));
    }

    function setupSkillBars() {
        const bars = $$(".skill-progress");
        if (!bars.length) return;

        function fillBar(bar) {
            const progress = bar.dataset.progress || "0";
            bar.style.width = `${progress}%`;
        }

        if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
            bars.forEach(fillBar);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    fillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.45 });

        bars.forEach((bar) => observer.observe(bar));
    }

    function setupCounters() {
        const statNumbers = $$(".stat-number");
        const recapNumbers = $$(".recap-number");
        const allCounters = [...statNumbers, ...recapNumbers];
        if (!allCounters.length) return;

        const targets = new Map();
        allCounters.forEach((counter) => {
            const raw = counter.dataset.target || cleanText(counter);
            const value = Number.parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
            const suffix = counter.dataset.target ? "" : raw.replace(/[\d.]/g, "");
            const decimals = raw.includes(".") ? 1 : 0;
            targets.set(counter, { value, suffix, decimals });
        });

        function animateCounter(counter) {
            const target = targets.get(counter);
            if (!target) return;
            if (prefersReducedMotion()) {
                counter.textContent = `${target.value.toFixed(target.decimals)}${target.suffix}`;
                return;
            }

            const start = performance.now();
            const duration = 1100;
            const step = (now) => {
                const progress = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target.value * eased;
                counter.textContent = `${value.toFixed(target.decimals)}${target.suffix}`;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }

        if (!("IntersectionObserver" in window)) {
            allCounters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });

        allCounters.forEach((counter) => observer.observe(counter));
    }

    function setupLazyImages() {
        const images = $$("img[data-src]");
        if (!images.length) return;

        function loadImage(img) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            if (img.complete) {
                img.classList.add("loaded");
            } else {
                img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
            }
        }

        if (!("IntersectionObserver" in window)) {
            images.forEach(loadImage);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "260px 0px" });

        images.forEach((img) => observer.observe(img));
    }

    function setupCursorTrail() {
        const trail = $(".cursor-trail");
        if (!trail || prefersReducedMotion() || isTouch()) {
            if (trail) trail.style.display = "none";
            return;
        }

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let tx = x;
        let ty = y;

        document.addEventListener("pointermove", (event) => {
            tx = event.clientX;
            ty = event.clientY;
            trail.classList.add("active");
        }, { passive: true });

        document.addEventListener("pointerleave", () => trail.classList.remove("active"));

        function animate() {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            requestAnimationFrame(animate);
        }
        animate();
    }

    function setupTooltips() {
        const tooltip = $("#tooltip");
        if (!tooltip || isTouch()) return;

        const targets = [
            ...$$("[aria-label]"),
            ...$$("[data-tooltip]")
        ].filter((node) => !node.closest(".chatbot-runner") && !["INPUT", "TEXTAREA"].includes(node.tagName));

        function show(content, event) {
            if (!content) return;
            tooltip.textContent = content;
            tooltip.style.left = `${event.clientX}px`;
            tooltip.style.top = `${event.clientY}px`;
            tooltip.classList.add("show");
        }

        function move(event) {
            tooltip.style.left = `${event.clientX}px`;
            tooltip.style.top = `${event.clientY}px`;
        }

        function hide() {
            tooltip.classList.remove("show");
        }

        targets.forEach((target) => {
            const content = target.dataset.tooltip || target.getAttribute("aria-label");
            target.addEventListener("mouseenter", (event) => show(content, event));
            target.addEventListener("mousemove", move);
            target.addEventListener("mouseleave", hide);
        });
    }

    function setupContactForm() {
        const form = $(".contact-form");
        if (!form) return;

        const fields = $$("input, textarea", form);
        const submit = $("button[type='submit']", form);
        const originalSubmit = submit ? submit.innerHTML : "";

        function removeError(field) {
            field.classList.remove("error");
            const error = field.parentElement.querySelector(".error-message");
            if (error) error.remove();
        }

        function showError(field, message) {
            removeError(field);
            field.classList.add("error");
            const error = document.createElement("div");
            error.className = "error-message";
            error.textContent = message;
            field.parentElement.appendChild(error);
        }

        function validate(field) {
            const value = field.value.trim();
            if (field.required && !value) {
                showError(field, "This field is required");
                return false;
            }
            if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(field, "Enter a valid email address");
                return false;
            }
            if (field.id === "name" && value && value.length < 2) {
                showError(field, "Name must be at least 2 characters");
                return false;
            }
            if (field.tagName === "TEXTAREA" && value && value.length < 10) {
                showError(field, "Message must be at least 10 characters");
                return false;
            }
            removeError(field);
            return true;
        }

        function showMessage(message, type) {
            const existing = $(".form-message", form);
            if (existing) existing.remove();
            const node = document.createElement("div");
            node.className = `form-message ${type}`;
            node.textContent = message;
            form.insertBefore(node, submit || null);
            window.setTimeout(() => node.remove(), 5500);
        }

        fields.forEach((field) => {
            field.addEventListener("blur", () => validate(field));
            field.addEventListener("input", () => {
                if (field.classList.contains("error")) validate(field);
            });
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const valid = fields.every(validate);
            if (!valid) {
                showMessage("Please fix the highlighted fields.", "error");
                return;
            }

            if (!submit) return;
            submit.disabled = true;
            submit.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Sending";

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { Accept: "application/json" }
                });

                if (!response.ok) throw new Error("Form submission failed");
                showMessage("Message sent successfully. I will get back to you soon.", "success");
                form.reset();
            } catch (error) {
                showMessage("Could not send the message. Please try again or email me directly.", "error");
            } finally {
                submit.disabled = false;
                submit.innerHTML = originalSubmit;
            }
        });
    }

    function setupBackToTop() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "back-to-top";
        button.setAttribute("aria-label", "Back to top");
        button.innerHTML = "<i class='fas fa-arrow-up'></i>";
        document.body.appendChild(button);

        function update() {
            button.classList.toggle("show", window.scrollY > 420);
        }

        button.addEventListener("click", () => {
            if (window.__portfolioScrollTo) window.__portfolioScrollTo("home");
            else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function buildPortfolioData() {
        const skills = $$(".skill-name").map(cleanText).filter(Boolean);
        const skillPercents = $$(".skill-item").map((item) => {
            const name = cleanText($(".skill-name", item));
            const percent = cleanText($(".skill-percent", item));
            return name ? `${name} ${percent}` : "";
        }).filter(Boolean);
        const tools = $$(".badge").map(cleanText).filter(Boolean);
        const projects = $$(".project-card").map((card) => ({
            title: cleanText($(".project-title", card)),
            description: cleanText($(".project-description", card)),
            tech: $$(".tech-tag", card).map(cleanText).filter(Boolean),
            links: $$("a[href]", card).map((link) => ({
                href: link.getAttribute("href"),
                label: cleanText(link) || link.getAttribute("aria-label") || "Open"
            }))
        })).filter((project) => project.title);
        const contacts = $$(".contact-method").map((method) => ({
            label: cleanText($("h4", method)),
            value: cleanText($("a", method)),
            href: $("a", method) ? $("a", method).getAttribute("href") : ""
        })).filter((contact) => contact.label);
        const experience = $$(".timeline-item").map((item) => ({
            date: cleanText($(".timeline-date", item)),
            title: cleanText($(".timeline-title", item)),
            description: cleanText($(".timeline-description", item))
        })).filter((item) => item.title);

        return {
            name: cleanText($("#hero-title")) || "Sughosha K Joshi",
            role: cleanText($(".hero-subtitle")),
            intro: cleanText($(".hero-description")),
            about: $$(".about-text p").map(cleanText).filter(Boolean).join(" "),
            stats: $$(".stat-item").map((item) => `${cleanText($(".stat-number", item))} ${cleanText($(".stat-label", item))}`).filter(Boolean),
            skills,
            skillPercents,
            tools,
            projects,
            contacts,
            experience
        };
    }

    function setupChatbot() {
        const data = buildPortfolioData();
        const runner = document.createElement("div");
        runner.className = "chatbot-runner";
        runner.innerHTML = `
            <button class="chatbot-avatar" type="button" aria-label="Open Pixel chat">
                <span class="bot-antenna" aria-hidden="true"></span>
                <span class="bot-arm bot-arm-left" aria-hidden="true"></span>
                <span class="bot-arm bot-arm-right" aria-hidden="true"></span>
                <span class="bot-leg bot-leg-left" aria-hidden="true"></span>
                <span class="bot-leg bot-leg-right" aria-hidden="true"></span>
                <span class="bot-face" aria-hidden="true">
                    <span class="bot-blush bot-blush-left"></span>
                    <span class="bot-blush bot-blush-right"></span>
                    <span class="bot-mouth"></span>
                </span>
            </button>
            <div class="chatbot-panel" role="dialog" aria-label="Pixel chat">
                <div class="chat-header">
                    <div>
                        <p class="chat-title">Pixel</p>
                        <div class="chat-status">online</div>
                    </div>
                    <button class="chat-close" type="button" aria-label="Close chat"><i class="fas fa-times"></i></button>
                </div>
                <div class="chat-messages"></div>
                <div>
                    <div class="chat-suggestions"></div>
                    <form class="chat-form">
                        <input class="chat-input" type="text" autocomplete="off" aria-label="Ask Pixel" placeholder="Ask anything">
                        <button class="chat-send" type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(runner);

        const panel = $(".chatbot-panel", runner);
        document.body.appendChild(panel);
        const avatar = $(".chatbot-avatar", runner);
        const close = $(".chat-close", panel);
        const messages = $(".chat-messages", panel);
        const form = $(".chat-form", panel);
        const input = $(".chat-input", panel);
        const suggestions = $(".chat-suggestions", panel);
        const suggestionLabels = ["Projects", "Skills", "Contact", "What is React?"];
        let openedOnce = false;
        let dragState = null;
        let suppressClick = false;
        let petTimer = null;
        let position = getDefaultBotPosition();

        function reactToTouch() {
            runner.classList.add("is-petted");
            window.clearTimeout(petTimer);
            petTimer = window.setTimeout(() => runner.classList.remove("is-petted"), 900);
        }

        function getDefaultBotPosition() {
            return {
                x: Math.max(16, window.innerWidth - 122),
                y: Math.max(96, window.innerHeight - 184)
            };
        }

        function clampPosition(x, y) {
            const maxX = Math.max(16, window.innerWidth - runner.offsetWidth - 16);
            const maxY = Math.max(92, window.innerHeight - runner.offsetHeight - 36);
            return {
                x: Math.min(Math.max(16, x), maxX),
                y: Math.min(Math.max(92, y), maxY)
            };
        }

        function setPosition(x, y) {
            position = clampPosition(x, y);
            if (!runner.classList.contains("is-open")) {
                runner.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
            }
        }

        function addMessage(content, type = "bot") {
            const node = document.createElement("div");
            node.className = `chat-msg ${type}`;
            node.textContent = content;
            messages.appendChild(node);
            messages.scrollTop = messages.scrollHeight;
        }

        function openChat() {
            runner.classList.add("is-open");
            panel.classList.add("is-open");
            if (!openedOnce) {
                addMessage(`Hey, I am Pixel. Ask me about ${data.name}, projects, skills, contact, or quick tech basics.`);
                openedOnce = true;
            }
            window.setTimeout(() => input.focus(), 160);
        }

        function closeChat() {
            runner.classList.remove("is-open");
            panel.classList.remove("is-open");
            setPosition(position.x, position.y);
        }

        function toggleChat() {
            if (runner.classList.contains("is-open")) closeChat();
            else openChat();
        }

        function roam() {
            if (runner.classList.contains("is-open") || runner.classList.contains("is-dragging") || prefersReducedMotion()) return;
            const margin = 22;
            const rightX = window.innerWidth - runner.offsetWidth - margin;
            const bottomY = window.innerHeight - runner.offsetHeight - 54;
            const sideRange = Math.max(1, window.innerHeight - runner.offsetHeight - 230);
            const bottomRange = Math.max(1, window.innerWidth - runner.offsetWidth - 320);
            const edgePositions = [
                { x: rightX, y: 112 + Math.random() * sideRange },
                { x: rightX, y: bottomY },
                { x: 300 + Math.random() * bottomRange, y: bottomY },
                { x: margin, y: Math.max(180, bottomY) }
            ];
            const next = edgePositions[Math.floor(Math.random() * edgePositions.length)];
            setPosition(next.x, next.y);
        }

        function answer(question) {
            const q = question.toLowerCase();
            const projectsText = data.projects.map((project) => project.title).join(", ");
            const contact = data.contacts.map((item) => `${item.label}: ${item.value} (${item.href})`).join(" | ");

            if (/(hi|hello|hey|yo)\b/.test(q)) {
                return `Hey. I can help you explore ${data.name}'s portfolio.`;
            }

            if (/(who|about|intro|name)/.test(q)) {
                return `${data.name} is a ${data.role}. ${data.intro}`;
            }

            if (/(skill|language|stack|tech|technology)/.test(q)) {
                return `Core skills: ${data.skillPercents.join(", ")}. Tools: ${data.tools.join(", ")}.`;
            }

            if (/(project|work|portfolio|build|made)/.test(q)) {
                const match = data.projects.find((project) => q.includes(project.title.toLowerCase().split(" ")[0]));
                if (match) {
                    return `${match.title}: ${match.description} Stack: ${match.tech.join(", ")}.`;
                }
                return `Projects here: ${projectsText}. The project cards have live/source links where available.`;
            }

            if (/(contact|email|mail|github|linkedin|instagram|discord|reach)/.test(q)) {
                return contact || "Contact details are in the contact section.";
            }

            if (/(experience|intern|student|education|gpa|journey)/.test(q)) {
                return data.experience.map((item) => `${item.title} (${item.date})`).join(" | ");
            }

            if (/(stat|number|years|gpa|projects completed)/.test(q)) {
                return data.stats.join(" | ");
            }

            if (/(react|component|jsx)/.test(q)) {
                return "React is a JavaScript library for building user interfaces with reusable components and state-driven rendering.";
            }

            if (/(node|node.js|backend)/.test(q)) {
                return "Node.js runs JavaScript outside the browser, often used for APIs, servers, tooling, and real-time apps.";
            }

            if (/(javascript| js\b)/.test(q)) {
                return "JavaScript adds behavior to web pages: events, data fetching, animations, validation, and app logic.";
            }

            if (/(html|css)/.test(q)) {
                return "HTML gives a page structure. CSS controls layout, visual style, responsiveness, and motion.";
            }

            if (/(api|rest)/.test(q)) {
                return "An API is a contract that lets software systems communicate. REST APIs usually expose resources through URLs and HTTP methods.";
            }

            if (/(git|github)/.test(q)) {
                return "Git tracks code history locally. GitHub hosts repositories online for collaboration, issues, pull requests, and deployments.";
            }

            if (/(mongodb|database|sql)/.test(q)) {
                return "Databases store and query application data. SQL is relational; MongoDB stores document-shaped data.";
            }

            if (/(thanks|thank you)/.test(q)) {
                return "Anytime. I will keep the tour moving.";
            }

            return `I can answer from this portfolio data: skills, projects, experience, stats, and contact. Try asking about ${data.projects[0] ? data.projects[0].title : "a project"}.`;
        }

        suggestionLabels.forEach((label) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "chat-suggestion";
            button.textContent = label;
            button.addEventListener("click", () => {
                input.value = label;
                form.requestSubmit();
            });
            suggestions.appendChild(button);
        });

        avatar.addEventListener("pointerdown", (event) => {
            if (runner.classList.contains("is-open")) return;
            reactToTouch();
            dragState = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                offsetX: event.clientX - position.x,
                offsetY: event.clientY - position.y,
                moved: false
            };
            avatar.setPointerCapture(event.pointerId);
            runner.classList.add("is-dragging");
        });

        avatar.addEventListener("pointermove", (event) => {
            if (!dragState || dragState.pointerId !== event.pointerId) return;
            const dx = event.clientX - dragState.startX;
            const dy = event.clientY - dragState.startY;
            if (Math.hypot(dx, dy) > 5) dragState.moved = true;
            if (dragState.moved) {
                setPosition(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
            }
        });

        avatar.addEventListener("pointerup", (event) => {
            if (!dragState || dragState.pointerId !== event.pointerId) return;
            suppressClick = dragState.moved;
            runner.classList.remove("is-dragging");
            dragState = null;
            window.setTimeout(() => {
                suppressClick = false;
            }, 0);
        });

        avatar.addEventListener("pointercancel", () => {
            runner.classList.remove("is-dragging");
            dragState = null;
        });

        avatar.addEventListener("mouseenter", reactToTouch);

        avatar.addEventListener("click", () => {
            if (suppressClick) return;
            toggleChat();
        });

        close.addEventListener("click", closeChat);

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const value = input.value.trim();
            if (!value) return;
            addMessage(value, "user");
            input.value = "";
            window.setTimeout(() => addMessage(answer(value), "bot"), 180);
        });

        window.addEventListener("resize", () => {
            const next = clampPosition(position.x, position.y);
            setPosition(next.x, next.y);
        }, { passive: true });

        setPosition(position.x, position.y);
        window.setInterval(roam, 5200);
        window.setTimeout(roam, 1600);
    }
})();
