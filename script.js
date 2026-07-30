// 3D Tilt Effect for Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .price-card, .dash-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Dynamic glow effect inside card
            let glowContainer = card.querySelector('.glow-container');
            if (!glowContainer) {
                glowContainer = document.createElement('div');
                glowContainer.className = 'glow-container';
                glowContainer.style.position = 'absolute';
                glowContainer.style.top = '0';
                glowContainer.style.left = '0';
                glowContainer.style.width = '100%';
                glowContainer.style.height = '100%';
                glowContainer.style.overflow = 'hidden';
                glowContainer.style.borderRadius = 'inherit';
                glowContainer.style.pointerEvents = 'none';
                glowContainer.style.zIndex = '0';
                card.style.position = 'relative';
                
                // Keep content above glow
                Array.from(card.children).forEach(child => {
                    if(child !== glowContainer) {
                        child.style.position = 'relative';
                        child.style.zIndex = '1';
                    }
                });

                const glow = document.createElement('div');
                glow.className = 'glow-effect';
                glow.style.position = 'absolute';
                glow.style.width = '200px';
                glow.style.height = '200px';
                glow.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)';
                glow.style.borderRadius = '50%';
                glow.style.transition = 'opacity 0.3s';
                glow.style.opacity = '0';
                glow.style.mixBlendMode = 'screen';
                
                glowContainer.appendChild(glow);
                card.appendChild(glowContainer);
            }
            
            const glow = glowContainer.querySelector('.glow-effect');
            glow.style.left = `${x - 100}px`;
            glow.style.top = `${y - 100}px`;
            glow.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            const glowContainer = card.querySelector('.glow-container');
            if (glowContainer) {
                const glow = glowContainer.querySelector('.glow-effect');
                if (glow) glow.style.opacity = '0';
            }
        });
    });
    
    // Canvas Wave Lines Background (Optimized, No Shadows)
    const initWaves = () => {
        let canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'bg-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.zIndex = '-2';
            canvas.style.pointerEvents = 'none';
            
            const bgEffects = document.querySelector('.background-effects');
            if (bgEffects) bgEffects.appendChild(canvas);
            else document.body.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = width / 2;
        let targetMouseY = height / 2;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Track mouse position globally for the waves
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        const linesCount = 45;
        const pointsPerLine = 80;
        let time = 0;

        const draw = () => {
            // Clear without trails to save GPU fill rate
            ctx.clearRect(0, 0, width, height);
            time += 0.002;
            
            // Smooth mouse following
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;
            
            ctx.lineWidth = 1.5;
            ctx.globalCompositeOperation = 'screen';
            
            for (let i = 0; i < linesCount; i++) {
                ctx.beginPath();
                const normY = i / (linesCount - 1);
                
                for (let j = 0; j <= pointsPerLine; j++) {
                    const normX = j / pointsPerLine;
                    const x = normX * width;
                    // Distribute lines mostly in the middle/bottom
                    const baseY = height * 0.15 + normY * height * 0.85;
                    
                    // Complex fluid wave motion
                    const wave1 = Math.sin(normX * 4 + time * 3 + normY * 6) * 60;
                    const wave2 = Math.cos(normX * 7 - time * 2 + normY * 8) * 35;
                    
                    let y = baseY + wave1 + wave2;
                    
                    // Mouse magnetic reaction
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 300;
                    
                    if (dist < maxDist) {
                        const force = Math.pow(1 - dist / maxDist, 2);
                        // Make waves bulge away from the mouse
                        const angle = Math.atan2(dy, dx);
                        y -= Math.sin(angle) * force * 60;
                        // y -= force * 40; // Alternative simple push
                    }

                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                // Opacity fades out at top and bottom lines
                const opacity = Math.sin(normY * Math.PI) * 0.5;
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                ctx.stroke();
            }
            
            requestAnimationFrame(draw);
        };
        
        draw();
    };

    initWaves();

    // CUSTOM LIQUID CURSOR
    const cursorCore = document.createElement('div');
    cursorCore.id = 'cursor-core';
    const cursorBlob = document.createElement('div');
    cursorBlob.id = 'cursor-blob';
    document.body.appendChild(cursorBlob);
    document.body.appendChild(cursorCore);

    let cursX = window.innerWidth/2, cursY = window.innerHeight/2;
    let blobX = cursX, blobY = cursY;
    
    document.addEventListener('mousemove', (e) => {
        cursX = e.clientX;
        cursY = e.clientY;
        cursorCore.style.transform = `translate(${cursX}px, ${cursY}px) translate(-50%, -50%)`;
        
        // Add trail dots randomly
        if (Math.random() < 0.2) {
            const trail = document.createElement('div');
            trail.className = 'trail-dot';
            trail.style.left = `${cursX}px`;
            trail.style.top = `${cursY}px`;
            trail.style.transform = `translate(-50%, -50%)`;
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 600);
        }
    });

    const drawBlob = () => {
        blobX += (cursX - blobX) * 0.15;
        blobY += (cursY - blobY) * 0.15;
        cursorBlob.style.transform = `translate(${blobX}px, ${blobY}px) translate(-50%, -50%)`;
        requestAnimationFrame(drawBlob);
    };
    drawBlob();

    document.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.transform = `translate(-50%, -50%)`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    document.querySelectorAll('a, button, .price-card, .feature-card, .dash-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // REAL 3D LOGO
    const Logo3D = (function(){
        if(typeof THREE === 'undefined') return { create(){}};

        function roundedRectPath(path, x, y, w, h, r){
            path.moveTo(x+r, y);
            path.lineTo(x+w-r, y);
            path.quadraticCurveTo(x+w, y, x+w, y+r);
            path.lineTo(x+w, y+h-r);
            path.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            path.lineTo(x+r, y+h);
            path.quadraticCurveTo(x, y+h, x, y+h-r);
            path.lineTo(x, y+r);
            path.quadraticCurveTo(x, y, x+r, y);
        }

        const outer = new THREE.Shape();
        roundedRectPath(outer, -1, -1, 2, 2, 0.55);
        const holePath = new THREE.Path();
        roundedRectPath(holePath, -0.56, -0.56, 1.12, 1.12, 0.3);
        outer.holes.push(holePath);

        const sharedGeometry = new THREE.ExtrudeGeometry(outer, {
            depth:0.36, bevelEnabled:true, bevelThickness:0.07, bevelSize:0.06, bevelSegments:4, curveSegments:14
        });
        sharedGeometry.center();

        const instances = [];

        function create(canvas, opts){
            opts = opts || {};
            const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
            camera.position.set(0, 0, 3.4);

            const material = new THREE.MeshStandardMaterial({
                color: 0x8a7bff,
                emissive: 0x8a7bff,
                emissiveIntensity: 0.55,
                metalness: 0.35,
                roughness: 0.22,
            });
            const mesh = new THREE.Mesh(sharedGeometry, material);
            mesh.rotation.z = Math.PI/4;
            scene.add(mesh);

            scene.add(new THREE.AmbientLight(0xffffff, 0.55));
            const lightA = new THREE.PointLight(0xd9b978, 2.2, 12);
            const lightB = new THREE.PointLight(0x8a7bff, 1.6, 12);
            scene.add(lightA, lightB);

            function resize(){
                const w = canvas.clientWidth || opts.size || 34;
                const h = canvas.clientHeight || opts.size || 34;
                renderer.setSize(w, h, false);
                camera.aspect = w/h;
                camera.updateProjectionMatrix();
            }
            resize();
            window.addEventListener('resize', resize);

            const inst = {
                canvas, renderer, scene, camera, mesh, material, lightA, lightB,
                spinSpeed: opts.baseSpeed || 0.006,
                burstSpin: 0, tiltX: 0, tiltY: 0, targetTiltX: 0, targetTiltY: 0, interactive: !!opts.interactive,
            };
            instances.push(inst);
            return inst;
        }

        let t = 0;
        function tick(){
            requestAnimationFrame(tick);
            t += 0.016;
            instances.forEach(inst=>{
                inst.burstSpin *= 0.94;
                inst.mesh.rotation.y += inst.spinSpeed + inst.burstSpin;
                inst.mesh.rotation.x = Math.sin(t*0.6) * 0.12;
                inst.lightA.position.set(Math.cos(t*0.7)*3, Math.sin(t*0.5)*3, 2.5);
                inst.lightB.position.set(Math.cos(t*0.7+Math.PI)*3, Math.sin(t*0.5+Math.PI)*3, 2.2);
                inst.renderer.render(inst.scene, inst.camera);
            });
        }
        tick();

        return { create };
    })();

    const canvasElements = document.querySelectorAll('#navLogo3d');
    canvasElements.forEach(canvas => {
        Logo3D.create(canvas, { size: 34, baseSpeed: 0.012 });
    });
});

    // SETTINGS PANEL & THEMES
    const settingsBtn = document.getElementById('openSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsOverlay = document.getElementById('settingsOverlay');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('open');
            settingsOverlay.classList.add('show');
        });
        
        const closeSettings = () => {
            settingsPanel.classList.remove('open');
            settingsOverlay.classList.remove('show');
        };
        
        closeSettingsBtn.addEventListener('click', closeSettings);
        settingsOverlay.addEventListener('click', closeSettings);
        
        // Themes
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                themeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const theme = card.getAttribute('data-theme');
                document.body.className = ''; // reset
                document.body.classList.add(	heme- + theme);
                
                // Update 3D logo colors based on theme if possible
                // Currently Logo3D doesn't expose refreshColors in our simplified version,
                // but setting CSS vars is enough for the rest of the site.
            });
        });
        
        // Background Particles Toggle
        const bgToggle = document.getElementById('bgEffectsToggle');
        bgToggle.addEventListener('change', (e) => {
            const bgEffects = document.querySelector('.background-effects');
            if (bgEffects) {
                bgEffects.style.opacity = e.target.checked ? '1' : '0';
                bgEffects.style.transition = 'opacity 0.3s ease';
            }
        });

        // Lang Switch logic (visual only for now)
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        const navLangSpans = document.querySelectorAll('.lang-switch span');
        navLangSpans.forEach(span => {
            span.addEventListener('click', () => {
                navLangSpans.forEach(s => s.classList.remove('active'));
                span.classList.add('active');
            });
        });
    }
