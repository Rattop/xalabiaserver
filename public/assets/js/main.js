'use strict';

// 1. Toast Notification System
const Toast = (() => {
    const el = document.getElementById('toast');
    let timer;

    return {
        show: (msg) => {
            el.textContent = msg;
            el.classList.add('show');
            clearTimeout(timer);
            timer = setTimeout(() => el.classList.remove('show'), 2500);
        }
    };
})();

// 2. Clipboard Logic
async function copyText(text, btn) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';
        Toast.show('Copiado para a área de transferência');
        setTimeout(() => btn.textContent = originalText, 2000);
    } catch (err) {
        Toast.show('Erro ao copiar');
    }
}

// 3. Spotlight Hover Effect (Estilo Vercel/Linear)
function initSpotlight() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Injeta as variáveis CSS locais no card
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initSpotlight();

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => copyText(btn.dataset.copy, btn));
    });

    console.log('%cOps Dashboard Initialized', 'color:#4ADE80; font-weight:bold;');
});
