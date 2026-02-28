// public/js/posts.js
import { graphqlRequest } from './graphql.js';
import { addLog } from './logs.js';
import { displayPosts, createPostElement, updatePostInUI } from './ui.js';

export async function loadPosts() {
    try {
        const query = `
            query GetAllPosts {
                posts {
                    id
                    text
                    author
                    likes
                    likedBy
                    createdAt
                }
            }
        `;

        const data = await graphqlRequest(query);
        displayPosts(data.posts);
        addLog('📦 посты загружены');
    } catch (error) {
        addLog(`❌ ошибка загрузки: ${error.message}`);
    }
}

export async function createPost() {
    const author = document.getElementById('author').value;
    const text = document.getElementById('text').value;

    if (!author || !text) {
        addLog('⚠️ заполните все поля');
        return;
    }

    try {
        const mutation = `
            mutation AddPost($text: String!, $author: String!) {
                addPost(text: $text, author: $author) {
                    id
                    text
                    author
                    likes
                    likedBy
                    createdAt
                }
            }
        `;

        await graphqlRequest(mutation, { text, author });

        document.getElementById('text').value = '';
        addLog(`✅ пост опубликован`);

    } catch (error) {
        addLog(`❌ ошибка: ${error.message}`);
    }
}

export async function likePost(postId) {
    try {
        const mutation = `
            mutation LikePost($id: ID!) {
                likePost(id: $id) {
                    id
                    likes
                    likedBy
                }
            }
        `;

        await graphqlRequest(mutation, { id: postId });
        addLog(`👍 действие с лайком выполнено`);

    } catch (error) {
        addLog(`❌ ошибка: ${error.message}`);
    }
}