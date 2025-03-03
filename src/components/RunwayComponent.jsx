import React, { useState } from 'react';
import { runwayService } from '../lib/runwayService';
import toast from 'react-hot-toast';

const RunwayComponent = () => {
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [videoId, setVideoId] = useState(null);

    const handleVideoGeneration = async () => {
        if (!prompt) {
            toast.error('Please enter a prompt');
            return;
        }

        try {
            setLoading(true);
            const result = await runwayService.createVideo(
                "YOUR_IMAGE_URL", // Replace with actual image URL
                {
                    id: "TEMPLATE_ID", // Replace with actual template ID
                    title: "Video Generation",
                    prompt: prompt,
                    style: "cinematic",
                    duration: 10
                }
            );

            setVideoId(result.videoId);
            toast.success('Video generation started!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input 
                    type="text"
                    className="w-full p-2 border rounded"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your video generation prompt"
                />
            </div>
            <button 
                onClick={handleVideoGeneration}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? 'Generating...' : 'Generate Video'}
            </button>
            {videoId && (
                <div className="mt-4">
                    <p>Video ID: {videoId}</p>
                    <p>Check your dashboard for the video status</p>
                </div>
            )}
        </div>
    );
};

export default RunwayComponent;