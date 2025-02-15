import axios from 'axios';

// Load API key from environment variables
const API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;
const BASE_URL = 'https://api.runwayml.com';  // Example, adjust according to docs

// Function to make API requests
export const runwayApiRequest = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${endpoint}`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Runway API Error:', error);
        throw error;
    }
};
