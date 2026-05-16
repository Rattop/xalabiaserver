/**
 * XalabiaServer - Core Script
 * Gerencia área de transferência, contadores e efeitos de interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. SISTEMA DE CÓPIA PARA ÁREA DE TRANSFERÊNCIA (CLIPBOARD API)
    // Usando data-attributes em vez de eventos inline no HTML
    // =========================================================================
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const textToCopy = button.getAttribute('data-copy');
            const originalText = button.innerText;
            const isPixBtn = button.classList.contains('pix-btn');

            try {
                // API Nativa do Browser
                await navigator.clipboard.writeText(textToCopy);
                
                // Feedback de Sucesso
                button.innerText = "✓ COPIADO COM SUCESSO!";
                button.style.backgroundColor = "#00FFFF";
                button.style.color = "#000000";
                
                // Retorna ao estado inicial após 2 segundos
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = "transparent";
                    
                    // Tratamento específico de cor para o botão do PIX e botão padrão
                    if (isPixBtn) {
                        button.style.color = "#FFFF00"; // Amarelo (Accent)
                    } else {
                        button.style.color = "#00FFFF"; // Ciano (Secondary)
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
            // Adiciona um valor randômico pequeno para simular tráfego
            hitCounter += Math.floor(Math.random() * 2);
            counterElement.textContent = String(hitCounter).padStart(6, '0');
        }, 12000);
    }

    // =========================================================================
    // 3. CONTADOR DE UPTIME (Tempo de atividade simulado/real)
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

    // Inicializa o contador e roda a cada 1 segundo
    updateUptime();
    setInterval(updateUptime, 1000);

    // =========================================================================
    // 4. EFEITO VISUAL DE RIPPLE (Onda no clique)
    // =========================================================================
    document.addEventListener('click', (e) => {
        // Ignora cliques em botões, links ou dentro do card do github para não sobrepor UI interativa
        if(e.target.tagName === 'BUTTON' || 
           e.target.tagName === 'A' || 
           e.target.closest('.github-btn')) {
            return;
        }

        const ripple = document.createElement('div');
        
        // Estilos base inline que precisam das coordenadas do mouse
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
        
        // Adiciona a keyframe globalmente na primeira vez que clicar
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
        
        // Limpa do DOM após a animação
        setTimeout(() => ripple.remove(), 800);
    });

    // =========================================================================
    // 5. EASTER EGG CONSOLE (A mensagem que os recrutadores vão adorar ver)
    // =========================================================================
    console.log('%c[SYSTEM] DEPLOYMENT BEM SUCEDIDO', 'color: #00FF00; font-size: 16px; font-weight: bold;');
    console.log('%cRepositório: https://github.com/Rattop/xalabiaserver', 'color: #00FFFF;');
    console.log('%cStacks Utilizadas: HTML5 Semântico, CSS Grid/Flexbox, Vanilla JS ES6.', 'color: #FFFF00;');
    console.log('%cAcesso restrito concedido. Bem-vindo ao laboratório.', 'color: #888888;');
});
