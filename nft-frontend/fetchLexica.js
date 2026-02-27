const https = require('https');

const fetchImages = (query) => {
    return new Promise((resolve, reject) => {
        https.get(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    // Return the first 4 image URLs
                    resolve(parsed.images.slice(0, 4).map(img => img.src));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', reject);
    });
};

const run = async () => {
    const cyberpunk = await fetchImages('cyberpunk dark neon avatar portrait');
    const futuristic = await fetchImages('futuristic sci-fi android face portrait');
    const abstract = await fetchImages('abstract 3d geometric glass neon octane render');
    const fantasy = await fetchImages('epic fantasy majestic dragon painting');

    console.log(JSON.stringify({ cyberpunk, futuristic, abstract, fantasy }, null, 2));
};

run();
