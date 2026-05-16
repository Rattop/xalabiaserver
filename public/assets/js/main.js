/**
 * XalabiaServer - Core Script
 * Gere área de transferência, contadores, efeitos de interface e Fastfetch.
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
                console.error("Falha ao aceder ao clipboard: ", err);
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

    // =========================================================================
    // 6. INTEGRAÇÃO COM FASTFETCH (Lê o TXT gerado pelo servidor)
    // =========================================================================
    const fetchOutput = document.getElementById('fastfetch-output');
    const btnRefresh = document.getElementById('btn-refresh-fetch');

    async function loadFastfetch() {
        if (!fetchOutput) return;

        try {
            if (btnRefresh) btnRefresh.innerText = "↻ CARREGANDO...";
            
            // O caminho absoluto (/assets/...) evita problemas de rotas no servidor
            const response = await fetch(`/assets/sysinfo.txt?t=${new Date().getTime()}`);
            
            if (response.ok) {
                const text = await response.text();
                // Colore as palavras-chave com base na saída padrão do fastfetch
                const coloredText = text
                    .replace(/OS:/g, '<span style="color: #00FF00;">OS:</span>')
                    .replace(/Host:/g, '<span style="color: #00FF00;">Host:</span>')
                    .replace(/Kernel:/g, '<span style="color: #00FF00;">Kernel:</span>')
                    .replace(/Uptime:/g, '<span style="color: #00FF00;">Uptime:</span>')
                    .replace(/Packages:/g, '<span style="color: #00FF00;">Packages:</span>')
                    .replace(/Shell:/g, '<span style="color: #00FF00;">Shell:</span>')
                    .replace(/Terminal:/g, '<span style="color: #00FF00;">Terminal:</span>')
                    .replace(/CPU:/g, '<span style="color: #00FF00;">CPU:</span>')
                    .replace(/GPU:/g, '<span style="color: #00FF00;">GPU:</span>')
                    .replace(/Memory:/g, '<span style="color: #00FF00;">Memory:</span>')
                    .replace(/Swap:/g, '<span style="color: #00FF00;">Swap:</span>')
                    .replace(/Disk/g, '<span style="color: #00FF00;">Disk')
                    .replace(/Local IP/g, '<span style="color: #00FF00;">Local IP')
                    .replace(/Battery/g, '<span style="color: #00FF00;">Battery')
                    .replace(/Locale:/g, '<span style="color: #00FF00;">Locale:</span>');
                
                fetchOutput.innerHTML = coloredText || "Nenhum dado retornado do servidor.";
            } else {
                fetchOutput.innerText = "Aguardando primeiro scan do servidor...";
            }
        } catch (error) {
            console.error("Erro ao carregar sysinfo:", error);
            fetchOutput.innerText = "[ERRO] Telemetria indisponível. Ficheiro não encontrado.";
        } finally {
            if (btnRefresh) btnRefresh.innerText = "↻ ATUALIZAR";
        }
    }

    // Carrega quando a página abre
    loadFastfetch();

    // Carrega quando o utilizador clica no botão
    if (btnRefresh) {
        btnRefresh.addEventListener('click', loadFastfetch);
    }
});
