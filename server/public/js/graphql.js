import { GRAPHQL_URL } from './config.js';

/**
 * Универсальная функция для GraphQL запросов
 */
export async function graphqlRequest(query, variables = {}) {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data;
}