// ImageExtract.js

import React, { useState, useEffect } from 'react';
import PreTraining from './PreTraining';

function ImageExtract() {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        // Generate 10 random image IDs between 1 and 2335
        const randomImageIds = Array.from({ length: 10 }, () => Math.floor(Math.random() * 2335) + 1);

        // Fetch images from each URL
        async function fetchImages() {
            try {
                const fetchedImageUrls = [];
                for (const id of randomImageIds) {
                    const url = `https://smishtank-direct-upload-s3.s3.us-west-1.amazonaws.com/images/${id}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.blob();
                        const imageUrl = URL.createObjectURL(data);
                        fetchedImageUrls.push(imageUrl);
                        console.log(imageUrl); // Log the image URL to the console
                    } else {
                        // Handle non-OK response (image not found, etc.)
                        console.error(`Failed to fetch image with ID ${id}`);
                    }
                }
                setImageUrls(fetchedImageUrls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        }

        fetchImages();
    }, []);

    return (
        <PreTraining imageUrls={imageUrls} />
    );
}

export default ImageExtract;