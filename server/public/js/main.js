import { setLogsContainer, clearLogs } from './logs.js';
import { setPostsContainer } from './ui.js';
import { setPostsContainer as setSocketPostsContainer } from './socket.js';
import { createPost, likePost, loadPosts } from './posts.js';
import { initSocketHandlers } from './socket.js';

// Делаем функции доступными глобально для onclick в HTML
window.createPost = createPost;
window.likePost = likePost;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем ссылки на контейнеры
    const postsContainer = document.getElementById('posts-container');
    const logsContainer = document.getElementById('logs');
    
    setPostsContainer(postsContainer);
    setSocketPostsContainer(postsContainer);
    setLogsContainer(logsContainer);

    // Навешиваем обработчик на кнопку очистки
    const clearBtn = document.getElementById('clearLogsBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearLogs);
    }

    // Инициализируем Socket.IO и обработчики
    const socket = io();
    initSocketHandlers(socket);
});