
async function loadFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Failed to load file:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error loading file:', error);
        return null;
    }
}