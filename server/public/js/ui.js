import { USER_ID } from './config.js';
import { addLog } from './logs.js';

let postsContainer = null;

export function setPostsContainer(container) {
    postsContainer = container;
}

export function displayPosts(posts) {
    if (!postsContainer) return;
    
    const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    postsContainer.innerHTML = '';

    sortedPosts.forEach(post => {
        const userLiked = post.likedBy?.includes(USER_ID) || false;
        const date = new Date(post.createdAt);
        const timeString = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const postElement = document.createElement('div');
        postElement.className = `post ${userLiked ? 'liked' : ''}`;
        postElement.id = `post-${post.id}`;
        postElement.innerHTML = `
            <div class="author">@${post.author} · ${timeString}</div>
            <div class="text">${post.text}</div>
            <div class="post-footer">
                <span class="likes">
                    <span class="heart">${userLiked ? '❤️' : '🤍'}</span>
                    ${post.likes || 0}
                </span>
                <button class="like-button" onclick="window.likePost('${post.id}')">
                    ${userLiked ? 'убрать лайк' : 'лайк'}
                </button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

export function createPostElement(post) {
    const userLiked = post.likedBy?.includes(USER_ID) || false;
    const date = new Date(post.createdAt);
    const timeString = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const div = document.createElement('div');
    div.className = `post ${userLiked ? 'liked' : ''}`;
    div.id = `post-${post.id}`;
    div.innerHTML = `
        <div class="author">@${post.author} · ${timeString}</div>
        <div class="text">${post.text}</div>
        <div class="post-footer">
            <span class="likes">
                <span class="heart">${userLiked ? '❤️' : '🤍'}</span>
                ${post.likes || 0}
            </span>
            <button class="like-button" onclick="window.likePost('${post.id}')">
                ${userLiked ? 'убрать лайк' : 'лайк'}
            </button>
        </div>
    `;
    return div;
}

export function updatePostInUI(updatedPost) {
    const userLiked = updatedPost.likedBy?.includes(USER_ID) || false;
    const postElement = document.getElementById(`post-${updatedPost.id}`);
    
    if (postElement) {
        const likesSpan = postElement.querySelector('.likes');
        const button = postElement.querySelector('.like-button');

        likesSpan.innerHTML = `<span class="heart">${userLiked ? '❤️' : '🤍'}</span> ${updatedPost.likes}`;
        button.textContent = userLiked ? 'убрать лайк' : 'лайк';

        if (userLiked) {
            postElement.classList.add('liked');
        } else {
            postElement.classList.remove('liked');
        }
    }
}