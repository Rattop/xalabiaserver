document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SISTEMA DE TOAST (Notificações) ---
    const toastElement = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        toastElement.textContent = message;
        toastElement.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastElement.classList.remove('show');
        }, 3000);
    }

    // --- 2. SISTEMA DE CÓPIA FUNCIONAL (Área de Transferência) ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault(); // Evita que a página pule
            
            // Pega o texto armazenado no atributo data-copy
            const textToCopy = button.getAttribute('data-copy');
            const originalText = button.innerHTML;
            
            try {
                // API Moderna do Navegador para copiar textos
                await navigator.clipboard.writeText(textToCopy);
                
                // Feedback Visual no botão
                button.innerHTML = '✓ Copiado!';
                button.classList.add('success');
                
                // Feedback na tela
                showToast(`Copiado: ${textToCopy}`);
                
                // Retorna ao estado original após 2 segundos
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('success');
                }, 2000);
                
            } catch (err) {
                console.error('Falha ao copiar:', err);
                showToast('Erro ao copiar. Tente selecionar manualmente.');
            }
        });
    });

    // --- 3. CONTADOR DE UPTIME (Simples e eficiente) ---
    const uptimeDisplay = document.getElementById('uptime-display');
    
    // Configuração inicial: 42 dias, 13 horas e 37 minutos (Convertido para segundos)
    let totalSeconds = (42 * 86400) + (13 * 3600) + (37 * 60);

    function updateUptime() {
        totalSeconds++;
        
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if(uptimeDisplay) {
            uptimeDisplay.innerHTML = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
        }
    }

    // Atualiza a cada 1 segundo (1000ms)
    setInterval(updateUptime, 1000);
    updateUptime(); // Chama imediatamente na carga da página

});
