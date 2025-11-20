/**
 * XalabiaServer - Visitor Counter
 * Sistema de contador de visitantes
 */

// ======================
// VISITOR COUNTER
// ======================
function initVisitorCounter() {
    const counterElement = document.getElementById('counter');
    
    if (!counterElement) return;
    
    let counter = 1337;
    
    // Incrementa o contador aleatoriamente
    setInterval(() => {
        counter += Math.floor(Math.random() * 3);
        counterElement.textContent = String(counter).padStart(6, '0');
    }, 10000); // A cada 10 segundos
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    initVisitorCounter();
    
    console.log('%c[Counter] Sistema de contador iniciado', 
        'color: #FFFF00;');
});