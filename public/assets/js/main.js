/**
 * XalabiaServer — main.js
 * Core functionality: copy buttons, toast notifications
 */

'use strict';

// ======================
// TOAST NOTIFICATION
// ======================
const Toast = (() => {
    const el = document.getElementById('toast');
    let timer = null;

    function show(message, type = 'default', duration = 2600) {
        if (!el) return;

        el.textContent = message;
        el.className = `toast show ${type}`;

        clearTimeout(timer);
        timer = setTimeout(() => {
            el.classList.remove('show');
        }, duration);
    }

    return { show };
})();

// ======================
// COPY TO CLIPBOARD
// ======================
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers / HTTP contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        } catch {
            document.body.removeChild(ta);
            return false;
        }
    }
}

// ======================
// SETUP COPY BUTTONS
// ======================
function setupCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            const ok = await copyToClipboard(text);

            if (ok) {
                // Truncate for display
                const display = text.length > 40
                    ? text.slice(0, 38) + '…'
                    : text;

                Toast.show(`✓ Copiado: ${display}`, 'success');

                // Visual feedback on button
                const originalText = btn.innerHTML;
                btn.classList.add('copied');
                const textNode = btn.querySelector('.btn-icon')
                    ? [...btn.childNodes].find(n => n.nodeType === 3 && n.textContent.trim())
                    : null;
                
                if (textNode) {
                    textNode.textContent = ' Copiado!';
                }

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalText;
                    // Re-bind the event listener is not needed — delegation handles it
                }, 2000);
            } else {
                Toast.show('✗ Falha ao copiar. Tente manualmente.', 'error');
            }
        });
    });
}

// ======================
// CONSOLE EASTER EGG
// ======================
function showEasterEgg() {
    const styles = {
        big:   'color:#00CFFF;font-size:18px;font-weight:bold;',
        info:  'color:#2EF08A;font-size:13px;',
        muted: 'color:#4E6480;font-size:12px;',
        warn:  'color:#FF6B35;font-size:13px;font-weight:bold;',
    };

    console.log('%c⬡ XalabiaServer', styles.big);
    console.log('%cArch Linux · Fibra 1 Gbps · Node-01 · São Paulo', styles.info);
    console.log('%c──────────────────────────────────────────────', styles.muted);
    console.log('%c🎮 Olá, hacker! Você encontrou o console!', styles.warn);
    console.log('%cSe você está lendo isso, provavelmente é o ratto.', styles.info);
    console.log('%cOu alguém com bom gosto em ferramentas de debug.', styles.muted);
    console.log('%c──────────────────────────────────────────────', styles.muted);
    console.log('%c[SYSTEM] TLS 1.3 ativo. Proxy reverso operacional.', styles.info);
    console.log('%c[SYSTEM] BTRFS com snapshots ativos.', styles.info);
    console.log('%c[SYSTEM] Uptime counter iniciado.', styles.info);
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    setupCopyButtons();
    showEasterEgg();
    console.log('%c[XalabiaServer] main.js carregado ✓', 'color:#2EF08A;');
});
