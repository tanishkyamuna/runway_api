import React, { useState } from 'react';
import { runwayApiRequest } from '../lib/runwayApi';

const RunwayComponent = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRunwayRequest = async () => {
        try {
            const data = {
                prompt: "Generate an AI video of cat and dogs", // Check Runway API docs for required fields
                model: "your_model_name", // Required if using specific AI models
            };
            const result = await runwayApiRequest('/v1/generate', data); // Adjust API path
            console.log(result);
        } catch (error) {
            console.error('API Request Failed:', error.response?.data || error.message);
        }
    };
    

    return (
        <div>
            <button onClick={handleRunwayRequest} disabled={loading}>
                {loading ? 'Processing...' : 'Send to Runway'}
            </button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
};

export default RunwayComponent;
