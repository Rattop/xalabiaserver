/**
 * XalabiaServer - Core Script
 * Gerencia área de transferência, contadores e efeitos de interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. SISTEMA DE CÓPIA PARA ÁREA DE TRANSFERÊNCIA (CLIPBOARD API)
    // =========================================================================
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const textToCopy = button.getAttribute('data-copy');
            const originalText = button.innerText;
            const isPixBtn = button.classList.contains('pix-btn');

            try {
                await navigator.clipboard.writeText(textToCopy);
                
                button.innerText = "✓ COPIADO COM SUCESSO!";
                button.style.backgroundColor = "#00FFFF";
                button.style.color = "#000000";
                
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = "transparent";
                    
                    if (isPixBtn) {
                        button.style.color = "#FFFF00";
                    } else {
                        button.style.color = "#00FFFF";
                    }
                }, 2000);

            } catch (err) {
                console.error("Falha ao acessar o clipboard: ", err);
                button.innerText = "ERRO AO COPIAR";
                setTimeout(() => button.innerText = "TENTAR NOVAMENTE", 2000);
            }
        });
    });

    // =========================================================================
    // 2. CONTADOR DE HITS (Estilo Retro)
    // =========================================================================
    const counterElement = document.getElementById('counter');
    let hitCounter = 1337;

    if (counterElement) {
        setInterval(() => {
            hitCounter += Math.floor(Math.random() * 2);
            counterElement.textContent = String(hitCounter).padStart(6, '0');
        }, 12000);
    }

    // =========================================================================
    // 3. CONTADOR DE UPTIME
    // Base inicial: 42 dias, 13 horas e 37 minutos
    // =========================================================================
    const uptimeElement = document.getElementById('uptime');
    let totalSeconds = (42 * 86400) + (13 * 3600) + (37 * 60);

    function updateUptime() {
        totalSeconds++;
        
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (uptimeElement) {
            uptimeElement.textContent = 
                `${days} dias, ` + 
                `${String(hours).padStart(2, '0')}:` + 
                `${String(minutes).padStart(2, '0')}:` + 
                `${String(seconds).padStart(2, '0')}`;
        }
    }

    updateUptime();
    setInterval(updateUptime, 1000);

    // =========================================================================
    // 4. EFEITO VISUAL DE RIPPLE (Onda no clique)
    // =========================================================================
    document.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON' || 
           e.target.tagName === 'A' || 
           e.target.closest('.github-btn')) {
            return;
        }

        const ripple = document.createElement('div');
        
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'radial-gradient(circle, rgba(0,255,0,0.5), transparent)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple-effect 0.8s ease-out';
        ripple.style.zIndex = '9999';
        
        if(!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple-effect {
                    to { width: 150px; height: 150px; margin-left: -75px; margin-top: -75px; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });

    // =========================================================================
    // 5. EASTER EGG CONSOLE
    // =========================================================================
    console.log('%c[SYSTEM] DEPLOYMENT BEM SUCEDIDO', 'color: #00FF00; font-size: 16px; font-weight: bold;');
    console.log('%cRepositório: https://github.com/Rattop/xalabiaserver', 'color: #00FFFF;');
    console.log('%cStacks Utilizadas: HTML5 Semântico, CSS Grid/Flexbox, Vanilla JS ES6.', 'color: #FFFF00;');
    console.log('%cAcesso restrito concedido. Bem-vindo ao laboratório.', 'color: #888888;');
});
