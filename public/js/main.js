/**
 * XalabiaServer - Main JavaScript
 * Funções principais do site
 */

// ======================
// COPY TO CLIPBOARD
// ======================
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert("✅ Texto copiado: " + texto);
    }).catch(err => {
        alert("❌ Erro ao copiar: " + err);
    });
}

// ======================
// SETUP COPY BUTTONS
// ======================
function setupCopyButtons() {
    const copyLinks = document.querySelectorAll('a[data-copy]');
    
    copyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = link.getAttribute('data-copy');
            copiarTexto(textToCopy);
        });
    });
}

// ======================
// UPTIME COUNTER
// ======================
function initUptime() {
    let days = 42;
    let hours = 13;
    let minutes = 37;
    let seconds = 0;
    
    const uptimeElement = document.getElementById('uptime');
    
    if (!uptimeElement) return;
    
    setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
                if (hours >= 24) {
                    hours = 0;
                    days++;
                }
            }
        }
        
        uptimeElement.textContent = 
            `${days} dias, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// ======================
// CONSOLE EASTER EGG
// ======================
function showConsoleEasterEgg() {
    console.log('%c🎮 VOCÊ ENCONTROU O EASTER EGG! 🎮', 
        'color: #00FF00; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00FF00;');
    console.log('%cBem-vindo ao XalabiaServer, hacker!', 
        'color: #00FFFF; font-size: 14px;');
    console.log('%c🔒 Agora com HTTPS seguro via proxy reverso!', 
        'color: #FFFF00; font-size: 14px;');
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    setupCopyButtons();
    initUptime();
    showConsoleEasterEgg();
    
    console.log('%c[XalabiaServer] Iniciado com sucesso!', 
        'color: #00FF00; font-weight: bold;');
});