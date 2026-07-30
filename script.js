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
});
