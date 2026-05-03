/* ===========================================
   Abdullah portfolio — vanilla JS
   - Sticky header on scroll
   - Mobile nav toggle
   - IntersectionObserver-based reveal
   - Footer year
   - Typewriter rotator
   - Subtle 3D tilt on work cards
   - Scroll progress bar
   - Magnetic CTAs
   - Card cursor spotlight
   - Count-up stats
   =========================================== */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    // ---------- Page entrance ----------
    requestAnimationFrame(() => document.body.classList.add('loaded'));

    // ---------- Theme toggle ----------
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') document.body.classList.remove('theme-light');
        else if (stored === 'light') document.body.classList.add('theme-light');
        themeBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('theme-light');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ---------- Footer year ----------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---------- Scroll-spy nav ----------
    const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
    if (sections.length && 'IntersectionObserver' in window) {
        const setActive = (id) => {
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        };
        const spy = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive('#' + visible.target.id);
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
        sections.forEach(s => spy.observe(s));
    }

    // ---------- Scroll progress + sticky header ----------
    const header = document.getElementById('header');
    const progress = document.getElementById('scroll-progress');
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 12);
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? (y / max) * 100 : 0;
            progress.style.width = pct + '%';
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Mobile nav ----------
    const toggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
        nav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.classList.remove('open');
            });
        });
    }

    // ---------- Reveal on scroll ----------
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('in-view'));
    }

    // ---------- Typewriter rotator ----------
    const rotator = document.querySelector('.rotator');
    if (rotator) {
        const words = Array.from(rotator.querySelectorAll('.rotator-word')).map(w => w.textContent.trim());
        rotator.innerHTML = '<span class="rotator-text"></span><span class="rotator-cursor" aria-hidden="true"></span>';
        const textEl = rotator.querySelector('.rotator-text');

        if (reduceMotion) {
            textEl.textContent = words[0] || '';
        } else {
            let wIdx = 0, cIdx = 0, deleting = false;
            const tick = () => {
                const word = words[wIdx];
                if (!deleting) {
                    cIdx++;
                    textEl.textContent = word.slice(0, cIdx);
                    if (cIdx === word.length) {
                        deleting = true;
                        setTimeout(tick, 1500);
                        return;
                    }
                    setTimeout(tick, 65 + Math.random() * 50);
                } else {
                    cIdx--;
                    textEl.textContent = word.slice(0, cIdx);
                    if (cIdx === 0) {
                        deleting = false;
                        wIdx = (wIdx + 1) % words.length;
                        setTimeout(tick, 250);
                        return;
                    }
                    setTimeout(tick, 30);
                }
            };
            tick();
        }
    }

    // ---------- Subtle 3D tilt on work cards ----------
    if (supportsHover && !reduceMotion) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const max = 6;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * max;
                const ry = (x - 0.5) * max;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---------- Card cursor spotlight ----------
    if (supportsHover && !reduceMotion) {
        const spotlightHosts = document.querySelectorAll('.work-card, .infra-card, .activity-card, .stack-col');
        spotlightHosts.forEach(host => {
            const spot = document.createElement('span');
            spot.className = 'card-spotlight';
            host.prepend(spot);
            host.addEventListener('mousemove', (e) => {
                const rect = host.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                host.style.setProperty('--mx', x + '%');
                host.style.setProperty('--my', y + '%');
            });
        });
    }

    // ---------- Magnetic CTAs ----------
    if (supportsHover && !reduceMotion) {
        const magnets = document.querySelectorAll('.btn-primary, .nav-cta');
        magnets.forEach(btn => {
            const strength = btn.classList.contains('nav-cta') ? 0.18 : 0.28;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * strength}px, ${y * strength * 0.9}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ---------- Live SRE terminal ----------
    const termBody = document.getElementById('term-body');
    if (termBody && !reduceMotion) {
        const wait = (ms) => new Promise(r => setTimeout(r, ms));
        const MAX_LINES = 14;

        const trim = () => {
            while (termBody.children.length > MAX_LINES) {
                termBody.removeChild(termBody.firstChild);
            }
        };

        const addLine = (html, cls = 'term-out') => {
            const div = document.createElement('div');
            div.className = `term-line ${cls}`;
            div.innerHTML = html;
            termBody.appendChild(div);
            trim();
            termBody.scrollTop = termBody.scrollHeight;
            return div;
        };

        const typeCommand = async (host, cmd) => {
            const div = document.createElement('div');
            div.className = 'term-line';
            const hostHtml = host
                ? `<span class="term-host">${host}</span><span class="term-prompt">$</span> `
                : `<span class="term-prompt">$</span> `;
            div.innerHTML = hostHtml + '<span class="term-cmd"></span><span class="cursor"></span>';
            termBody.appendChild(div);
            trim();
            const cmdEl = div.querySelector('.term-cmd');
            for (let i = 0; i < cmd.length; i++) {
                cmdEl.textContent += cmd[i];
                termBody.scrollTop = termBody.scrollHeight;
                await wait(28 + Math.random() * 38);
            }
            div.querySelector('.cursor').remove();
            await wait(280);
        };

        const progressBar = async (label, durMs = 1600) => {
            const div = document.createElement('div');
            div.className = 'term-line term-progress-line';
            div.innerHTML = `
                <div class="term-progress">
                    <span class="term-progress-label">${label}</span>
                    <div class="term-progress-bar"><div class="term-progress-fill"></div></div>
                    <span class="term-progress-pct">0%</span>
                </div>`;
            termBody.appendChild(div);
            trim();
            termBody.scrollTop = termBody.scrollHeight;
            const fill = div.querySelector('.term-progress-fill');
            const pct = div.querySelector('.term-progress-pct');
            const start = performance.now();
            await new Promise(resolve => {
                const tick = (now) => {
                    const t = Math.min((now - start) / durMs, 1);
                    const eased = 1 - Math.pow(1 - t, 1.6);
                    const v = Math.round(eased * 100);
                    fill.style.width = v + '%';
                    pct.textContent = v + '%';
                    if (t < 1) requestAnimationFrame(tick);
                    else resolve();
                };
                requestAnimationFrame(tick);
            });
        };

        const counter = async (label, from, to, durMs = 1400, suffix = '') => {
            const div = document.createElement('div');
            div.className = 'term-line';
            div.innerHTML = `<span class="term-out">${label} </span><span class="term-counter"><span class="term-counter-num">${from}</span>${suffix}</span>`;
            termBody.appendChild(div);
            trim();
            termBody.scrollTop = termBody.scrollHeight;
            const num = div.querySelector('.term-counter-num');
            const start = performance.now();
            await new Promise(resolve => {
                const tick = (now) => {
                    const t = Math.min((now - start) / durMs, 1);
                    const eased = 1 - Math.pow(1 - t, 2);
                    const v = Math.round(from + (to - from) * eased);
                    num.textContent = v;
                    if (t < 1) requestAnimationFrame(tick);
                    else resolve();
                };
                requestAnimationFrame(tick);
            });
        };

        const updateStat = (key, value) => {
            const el = document.querySelector(`[data-stat="${key}"]`);
            if (el) el.textContent = value;
        };

        // --- Scenes ---
        const sceneAptUpdate = async () => {
            await typeCommand('prod-fleet-01', 'sudo apt update');
            await wait(150);
            addLine('Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease', 'term-line term-out-dim'); await wait(90);
            addLine('Hit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease', 'term-line term-out-dim'); await wait(90);
            addLine('Get:3 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [128 kB]', 'term-line term-out-dim'); await wait(160);
            addLine('Reading package lists... Done', 'term-line term-out'); await wait(280);
            addLine('Building dependency tree... Done', 'term-line term-out'); await wait(220);
            addLine('142 packages can be upgraded. Run \'apt list --upgradable\' to see them.', 'term-line term-out-warn'); await wait(700);
        };

        const sceneAptUpgrade = async () => {
            await typeCommand('prod-fleet-01', 'sudo apt upgrade -y');
            addLine('The following packages will be upgraded:', 'term-line term-out'); await wait(160);
            addLine('  openssl libssl3 nginx-core curl libcurl4 nodejs containerd.io', 'term-line term-out-pkg'); await wait(140);
            addLine('142 upgraded, 0 newly installed, 0 to remove.', 'term-line term-out'); await wait(180);
            addLine('Need to get 86.4 MB of archives.', 'term-line term-out-dim'); await wait(220);
            await progressBar('Downloading 142 pkgs', 1700);
            await wait(150);
            addLine('Setting up openssl (3.0.2-0ubuntu1.12) ...', 'term-line term-out-info'); await wait(180);
            addLine('Setting up nginx-core (1.18.0-6ubuntu14.4) ...', 'term-line term-out-info'); await wait(160);
            addLine('Setting up containerd.io (1.7.13-1) ...', 'term-line term-out-info'); await wait(160);
            addLine('✓ 142/142 upgraded · 0 reboots required · 11.4s', 'term-line term-out-ok'); await wait(900);
            updateStat('hosts', 142);
        };

        const sceneScpPatch = async () => {
            await typeCommand(null, 'scp patches.tar.gz prod-fleet-02:/srv/patches/');
            addLine('Authenticated to prod-fleet-02 (10.42.0.18) via ed25519 key', 'term-line term-out-dim'); await wait(220);
            await progressBar('patches.tar.gz · 64.2MB', 1500);
            addLine('✓ Transfer complete · 64.2MB · 35.6 MB/s', 'term-line term-out-ok'); await wait(800);
        };

        const sceneDnfUpdate = async () => {
            await typeCommand('rhel-edge-09', 'sudo dnf update -y');
            addLine('Last metadata expiration check: 0:14:32 ago.', 'term-line term-out-dim'); await wait(180);
            addLine('Dependencies resolved.', 'term-line term-out'); await wait(160);
            addLine('Upgrading : kernel-5.14.0-503.40.1.el9_5  +  37 more pkgs', 'term-line term-out-pkg'); await wait(220);
            await progressBar('dnf transaction', 1300);
            addLine('Complete!  ·  Reboot scheduled in maintenance window', 'term-line term-out-ok'); await wait(800);
        };

        const sceneAwsSsm = async () => {
            await typeCommand(null, 'aws ssm send-command --document AWS-UpdateSSMAgent --targets Key=tag:Env,Values=prod');
            addLine('CommandId: 2f7e2c12-9c8a-4b1f-a3d0-7e5b9f1c0832', 'term-line term-out-dim'); await wait(200);
            addLine('Targets: 64 EC2 instances · regions: us-east-1, eu-west-2', 'term-line term-out-info'); await wait(220);
            await counter('Agents upgraded', 0, 64, 1700, '/64');
            addLine('✓ 64/64 EC2 agents upgraded · CloudWatch + SSM healthy', 'term-line term-out-ok'); await wait(800);
            updateStat('agents', 64);
        };

        const sceneForeman = async () => {
            await typeCommand('foreman-01', 'foreman-rake puppet:rebuild_config');
            addLine('Loading host groups: prod-app, prod-db, edge-cache, ingress', 'term-line term-out'); await wait(220);
            addLine('Smart proxy: vsphere-prod.local · sync started', 'term-line term-out-info'); await wait(220);
            await counter('Hosts converged', 0, 38, 1500, '/38');
            addLine('✓ Foreman → vSphere · 38 hosts drift-free', 'term-line term-out-ok'); await wait(800);
            updateStat('vms', 38);
        };

        const sceneKubectl = async () => {
            await typeCommand(null, 'kubectl rollout status deploy/api -n rehousing');
            addLine('Waiting for deployment "api" rollout to finish: 2 of 4 new replicas updated...', 'term-line term-out'); await wait(700);
            addLine('Waiting for deployment "api" rollout to finish: 4 of 4 new replicas updated...', 'term-line term-out'); await wait(600);
            addLine('deployment "api" successfully rolled out', 'term-line term-out-ok'); await wait(900);
        };

        const sceneElk = async () => {
            await typeCommand(null, 'curl -s elastic.internal:9200/_cluster/health | jq');
            addLine('{', 'term-line term-out-dim'); await wait(80);
            addLine('  "cluster_name": "prod-elk",', 'term-line term-out-dim'); await wait(80);
            addLine('  "status": "green",', 'term-line term-out-ok'); await wait(80);
            addLine('  "number_of_nodes": 9,', 'term-line term-out-dim'); await wait(80);
            addLine('  "active_shards_percent_as_number": 100.0', 'term-line term-out-dim'); await wait(80);
            addLine('}', 'term-line term-out-dim'); await wait(900);
        };

        const scenes = [sceneAptUpdate, sceneAptUpgrade, sceneScpPatch, sceneDnfUpdate, sceneAwsSsm, sceneForeman, sceneElk, sceneKubectl];

        let running = true;
        // Pause animation when terminal is offscreen for performance
        if ('IntersectionObserver' in window) {
            const tio = new IntersectionObserver(([e]) => { running = e.isIntersecting; },
                { threshold: 0.1 });
            tio.observe(termBody.closest('.term-card') || termBody);
        }

        const loop = async () => {
            let i = 0;
            while (true) {
                if (running) {
                    await scenes[i % scenes.length]();
                    i++;
                } else {
                    await wait(500);
                }
            }
        };
        loop();
    } else if (termBody) {
        // Reduced motion: show a static snapshot
        termBody.innerHTML = `
            <div class="term-line"><span class="term-host">prod-fleet-01</span><span class="term-prompt">$</span> sudo apt upgrade -y</div>
            <div class="term-line term-out-ok">✓ 142/142 upgraded · 0 reboots required</div>
            <div class="term-line"><span class="term-prompt">$</span> aws ssm send-command --document AWS-UpdateSSMAgent</div>
            <div class="term-line term-out-ok">✓ 64/64 EC2 agents upgraded</div>
            <div class="term-line"><span class="term-host">foreman-01</span><span class="term-prompt">$</span> foreman-rake puppet:rebuild_config</div>
            <div class="term-line term-out-ok">✓ 38 hosts drift-free</div>`;
    }

    // ---------- Synthetic GitHub contribution heatmap ----------
    const heatmap = document.querySelector('.heatmap-grid');
    if (heatmap) {
        const weeks = 53;
        const days = 7;
        // Seeded RNG so the pattern is deterministic across reloads
        let seed = 9380;
        const rng = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        const cells = [];
        for (let w = 0; w < weeks; w++) {
            for (let d = 0; d < days; d++) {
                const r = rng();
                const isWeekend = d === 0 || d === 6;
                let level;
                if (isWeekend) {
                    level = r < 0.45 ? 0 : r < 0.75 ? 1 : r < 0.92 ? 2 : 3;
                } else {
                    level = r < 0.06 ? 0 : r < 0.18 ? 1 : r < 0.42 ? 2 : r < 0.74 ? 3 : 4;
                }
                cells.push(`<div class="hm-cell hm-${level}" data-week="${w}" data-day="${d}"></div>`);
            }
        }
        heatmap.innerHTML = cells.join('');
    }

    // ---------- Count-up stats ----------
    const countEls = document.querySelectorAll('[data-count]');
    if (countEls.length && 'IntersectionObserver' in window) {
        const formatNumber = (val, useComma) => useComma ? val.toLocaleString() : String(val);
        const animate = (el) => {
            const target = parseFloat(el.dataset.count);
            if (isNaN(target)) return;
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const useComma = el.dataset.format === 'comma';
            if (reduceMotion) {
                el.textContent = prefix + formatNumber(target, useComma) + suffix;
                return;
            }
            const dur = target > 100 ? 1800 : 1200;
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                const val = Math.round(target * eased);
                el.textContent = prefix + formatNumber(val, useComma) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animate(e.target);
                    cio.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        countEls.forEach(el => cio.observe(el));
    }
})();
