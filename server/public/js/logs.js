// Контейнер для логов будет передан из main.js
let logsContainer = null;

export function setLogsContainer(container) {
    logsContainer = container;
}

export function addLog(message) {
    if (!logsContainer) return;
    
    const logElement = document.createElement('div');
    logElement.className = 'log';
    logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logsContainer.appendChild(logElement);
}

export function clearLogs() {
    if (!logsContainer) return;
    logsContainer.innerHTML = '';
    addLog('🗑️ логи очищены');
}