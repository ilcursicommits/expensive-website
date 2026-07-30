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

        const numPairs = 120; 
        const radius = 100;
        const heightStrand = Math.max(height * 1.5, 1200);
        const twists = 3.5;
        const pairs = [];

        for (let i = 0; i < numPairs; i++) {
            const t = i / numPairs;
            const angle = t * Math.PI * 2 * twists;
            const y = (t - 0.5) * heightStrand;
            
            // Random start positions for assemble effect
            const rx1 = (Math.random() - 0.5) * width * 3;
            const ry1 = (Math.random() - 0.5) * height * 3;
            const rz1 = (Math.random() - 0.5) * 2000;
            
            const rx2 = (Math.random() - 0.5) * width * 3;
            const ry2 = (Math.random() - 0.5) * height * 3;
            const rz2 = (Math.random() - 0.5) * 2000;

            pairs.push({
                y: y,
                angle: angle,
                start1: {x: rx1, y: ry1, z: rz1},
                start2: {x: rx2, y: ry2, z: rz2}
            });
        }

        let time = 0;
        let assembleProgress = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            if (assembleProgress < 1) assembleProgress += 0.004;
            const ease = 1 - Math.pow(1 - assembleProgress, 4);
            time += 0.005;

            ctx.save();
            // Move DNA slightly to the right so it doesn't block text, and tilt it
            ctx.translate(width * 0.7, height * 0.5);
            ctx.rotate(Math.PI / 12);
            
            ctx.globalCompositeOperation = 'screen';

            const fov = 800;
            
            // Calculate current 3D positions
            const projectedPairs = pairs.map(p => {
                const angle1 = p.angle + time;
                const angle2 = p.angle + time + Math.PI;
                
                const tx1 = Math.cos(angle1) * radius;
                const tz1 = Math.sin(angle1) * radius;
                
                const tx2 = Math.cos(angle2) * radius;
                const tz2 = Math.sin(angle2) * radius;
                
                const wobbleY = Math.cos(time * 3 + p.y * 0.01) * 20;
                const ty = p.y + wobbleY;

                // Interpolate from random to target
                const currX1 = p.start1.x + (tx1 - p.start1.x) * ease;
                const currY1 = p.start1.y + (ty - p.start1.y) * ease;
                const currZ1 = p.start1.z + (tz1 - p.start1.z) * ease;
                
                const currX2 = p.start2.x + (tx2 - p.start2.x) * ease;
                const currY2 = p.start2.y + (ty - p.start2.y) * ease;
                const currZ2 = p.start2.z + (tz2 - p.start2.z) * ease;

                const scale1 = fov / (fov + currZ1);
                const scale2 = fov / (fov + currZ2);
                
                return {
                    p1: { x: currX1 * scale1, y: currY1 * scale1, z: currZ1, s: scale1 },
                    p2: { x: currX2 * scale2, y: currY2 * scale2, z: currZ2, s: scale2 }
                };
            });
            
            // Draw backbone 1
            ctx.beginPath();
            for (let i = 0; i < projectedPairs.length; i++) {
                const pt = projectedPairs[i].p1;
                if (pt.s > 0) {
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * ease})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw backbone 2
            ctx.beginPath();
            for (let i = 0; i < projectedPairs.length; i++) {
                const pt = projectedPairs[i].p2;
                if (pt.s > 0) {
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();

            // Draw base pairs
            if (ease > 0.4) {
                ctx.beginPath();
                for (let i = 0; i < projectedPairs.length; i++) {
                    const pt1 = projectedPairs[i].p1;
                    const pt2 = projectedPairs[i].p2;
                    if (pt1.s > 0 && pt2.s > 0 && i % 3 === 0) {
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                    }
                }
                ctx.strokeStyle = `rgba(167, 139, 250, ${(ease - 0.4) * 0.15})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            
            // Draw glowing nodes
            const allDots = [];
            projectedPairs.forEach(p => {
                allDots.push(p.p1, p.p2);
            });
            allDots.sort((a, b) => b.z - a.z); // z-sort for proper overlapping shadows
            
            allDots.forEach(pt => {
                if (pt.s < 0) return;
                const r = Math.max(0.5, 3.5 * pt.s);
                const alpha = Math.min(1, Math.max(0.1, pt.s * ease));
                
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
                ctx.shadowBlur = 15 * pt.s;
                ctx.shadowColor = `rgba(167, 139, 250, ${alpha})`;
                ctx.fill();
            });

            ctx.restore();
            requestAnimationFrame(draw);
        };

        draw();
    };

    initDNA();
});
