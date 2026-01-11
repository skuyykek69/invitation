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
        // Use URLSearchParams to send application/x-www-form-urlencoded (simple request)
        const params = new URLSearchParams();
        params.append('id', id);
        params.append('name', name);
        params.append('status', status);
        params.append('message', message);
        params.append('date', date);
        params.append('color', color);

        try {
            const response = await fetch(data.api, {
                method: 'POST',
                // Do NOT set Content-Type manually; browser will set to application/x-www-form-urlencoded
                body: params
            });

            // Read response text and try parse to JSON
            const text = await response.text();
            try {
                const parsed = JSON.parse(text);
                if (!response.ok && parsed && parsed.message) {
                    throw new Error(parsed.message || `HTTP ${response.status}`);
                }
                return parsed;
            } catch (e) {
                // not JSON
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}${text ? ': ' + text : ''}`);
                }
                return { ok: true, raw: text };
            }
        } catch (error) {
            console.error('Post error:', error);
            return { error: error.message };
        }
    },
};
