import { addLog } from './logs.js';
import { loadPosts } from './posts.js';
import { createPostElement, updatePostInUI } from './ui.js';

let postsContainer = null;

export function setPostsContainer(container) {
    postsContainer = container;
}

export function initSocketHandlers(socket) {
    socket.on('connect', () => {
        addLog(`🔌 подключено (id: ${socket.id})`);
        loadPosts();
    });

    socket.on('disconnect', (reason) => {
        addLog(`🔌 отключено: ${reason}`);
    });

    socket.on('new-post', (post) => {
        addLog(`📝 новый пост от @${post.author}`);
        const postElement = createPostElement(post);
        postsContainer.prepend(postElement);
    });

    socket.on('post-updated', (updatedPost) => {
        addLog(`❤️ пост ${updatedPost.id} обновлен (лайков: ${updatedPost.likes})`);
        updatePostInUI(updatedPost);
    });
}