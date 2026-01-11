// contents
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

    addComentar: async function ({id, name, status, message, date, color}) {
        const comentar = { id, name, status, message, date, color };

        try {
            const response = await fetch(data.api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // remove mode: 'no-cors' so we can read the JSON response
                body: JSON.stringify(comentar),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Post error:', error);
            return { error: error.message };
        }
    },
};
