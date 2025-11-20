/**
 * XalabiaServer - Visual Effects
 * Efeitos visuais e interatividade
 */

// ======================
// RIPPLE CLICK EFFECT
// ======================
function createRippleEffect(e) {
    const ripple = document.createElement('div');
    
    // Estilos do ripple
    ripple.style.position = 'fixed';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'radial-gradient(circle, #00FF00, transparent)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 1s ease-out';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    // Remove o ripple após a animação
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// ======================
// GLITCH EFFECT (OPCIONAL)
// ======================
function randomGlitch() {
    const elements = document.querySelectorAll('.main-title h1');
    
    elements.forEach(el => {
        if (Math.random() > 0.95) { // 5% de chance
            el.style.textShadow = `
                ${Math.random() * 10}px ${Math.random() * 10}px 0 #FF00FF,
                ${Math.random() * -10}px ${Math.random() * -10}px 0 #00FFFF
            `;
            
            setTimeout(() => {
                el.style.textShadow = '';
            }, 100);
        }
    });
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Ativa o efeito ripple em todos os cliques
    document.addEventListener('click', createRippleEffect);
    
    // Efeito glitch aleatório a cada 5 segundos
    setInterval(randomGlitch, 5000);
    
    console.log('%c[Effects] Efeitos visuais ativados', 
        'color: #FF00FF;');
});