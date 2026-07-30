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
});
