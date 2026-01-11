import {data} from "../assets/data/data.js";

export const comentarService = {
    getComentar: async function () {
        try {
            const response = await fetch(data.api);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Get error:', error);
            return { error: error.message };
        }
    },

    addComentar: async function ({ id, name, status, message, date, color }) {
        const comentar = { id, name, status, message, date, color };

        try {
            const response = await fetch(data.api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Do NOT use `mode: 'no-cors'` so the client can read the server response.
                body: JSON.stringify(comentar),
            });

            if (!response.ok) {
                // Try to provide helpful error info if there is a response body
                const text = await response.text().catch(() => null);
                throw new Error(`HTTP ${response.status}${text ? ': ' + text : ''}`);
            }

            // Some Google Apps Script deployments return JSON text; attempt to parse, but fallback to raw text
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                return { ok: true, raw: text };
            }
        } catch (error) {
            console.error('Post error:', error);
            return { error: error.message };
        }
    },
};
