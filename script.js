const generateButton = document.getElementById('generateButton');
const promptInput = document.getElementById('promptInput');
const generatedImage = document.getElementById('generatedImage');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

generateButton.addEventListener('click', () => {
    const prompt = promptInput.value;
    if (prompt.trim() === "") {
        errorMessage.textContent = "Please enter a description!";
        return;
    }
    errorMessage.textContent = "";
    fetchGeneratedImage(prompt);
});

async function fetchGeneratedImage(prompt) {
    const apiKey = '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'; 
    const apiUrl = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4'; // Update URL if needed

    loadingSpinner.style.display = 'block'; 
    generatedImage.style.display = 'none';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if the response is JSON
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            throw new Error(`API response error: ${data.error || 'Unknown error'}`);
        }

        // Use a higher quality format if available
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        generatedImage.src = imageUrl;
        generatedImage.style.display = 'block'; // Show image
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    }
}