import axios from 'axios';

const API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;
const BASE_URL = 'https://api.runwayml.com/v1';  // Updated base URL

export const runwayApiRequest = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(
            `${BASE_URL}${endpoint}`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Runway API Error:', error);
        throw error;
    }
};