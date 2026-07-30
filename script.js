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
    
    // Canvas DNA Background
    const initDNA = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-2';
        canvas.style.pointerEvents = 'none';
        
        const bgEffects = document.querySelector('.background-effects');
        if (bgEffects) {
            bgEffects.appendChild(canvas);
        } else {
            document.body.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const numParticles = 600; 
        const radius = 120;
        const heightStrand = Math.max(height * 1.5, 1200);
        const twists = 4;

        for (let i = 0; i < numParticles; i++) {
            const t = i / numParticles;
            const angle = t * Math.PI * 2 * twists;
            const y = (t - 0.5) * heightStrand;
            
            const strand = i % 2;
            const phase = strand * Math.PI;
            
            const targetX = Math.cos(angle + phase) * radius;
            const targetZ = Math.sin(angle + phase) * radius;
            const targetY = y;

            particles.push({
                x: (Math.random() - 0.5) * width * 3,
                y: (Math.random() - 0.5) * height * 3,
                z: (Math.random() - 0.5) * 2000,
                tx: targetX,
                ty: targetY,
                tz: targetZ,
                baseAngle: angle + phase,
                yPhase: y
            });
        }

        let time = 0;
        let assembleProgress = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            if (assembleProgress < 1) assembleProgress += 0.005;
            const ease = 1 - Math.pow(1 - assembleProgress, 4);
            time += 0.005;

            const renderParticles = particles.map(p => {
                const currentTx = p.tx * Math.cos(time) - p.tz * Math.sin(time);
                const currentTz = p.tz * Math.cos(time) + p.tx * Math.sin(time);
                
                const wobbleX = Math.sin(time * 5 + p.yPhase * 0.02) * 15;
                const wobbleY = Math.cos(time * 4 + p.yPhase * 0.02) * 15;

                const finalX = currentTx + wobbleX;
                const finalY = p.ty + wobbleY;
                const finalZ = currentTz;

                const x = p.x + (finalX - p.x) * ease;
                const y = p.y + (finalY - p.y) * ease;
                const z = p.z + (finalZ - p.z) * ease;

                return { x, y, z, original: p };
            });

            renderParticles.sort((a, b) => b.z - a.z);

            ctx.save();
            ctx.translate(width / 2, height / 2);
            
            // Draw connecting links between strands
            if (ease > 0.5) {
                ctx.lineWidth = 1.5;
                for (let i = 0; i < renderParticles.length; i++) {
                    if (i % 6 === 0) { 
                        const p1 = renderParticles[i];
                        const p2 = renderParticles.find(p => p !== p1 && Math.abs(p.original.yPhase - p1.original.yPhase) < 10);
                        if (p2) {
                            const scale1 = 600 / (600 + p1.z);
                            const scale2 = 600 / (600 + p2.z);
                            const alpha = Math.min(1, (scale1 + scale2) / 2) * (ease - 0.5) * 2;
                            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.25})`;
                            ctx.beginPath();
                            ctx.moveTo(p1.x * scale1, p1.y * scale1);
                            ctx.lineTo(p2.x * scale2, p2.y * scale2);
                            ctx.stroke();
                        }
                    }
                }
            }

            renderParticles.forEach(p => {
                const scale = 600 / (600 + p.z);
                if (scale < 0) return;

                const px = p.x * scale;
                const py = p.y * scale;
                const r = Math.max(0.5, 4 * scale);

                const alpha = Math.min(1, Math.max(0.1, scale * ease));
                ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
                ctx.shadowBlur = 15 * scale;
                ctx.shadowColor = `rgba(139, 92, 246, ${alpha})`;
                
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
            requestAnimationFrame(draw);
        };

        draw();
    };

    initDNA();
});
