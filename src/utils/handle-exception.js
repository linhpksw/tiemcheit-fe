export const handleException = async (response) => {
    if (!response.ok) {
        let errorResponse;
        try {
            errorResponse = await response.json();
        } catch (jsonError) {
            // Fallback if the response is not JSON or cannot be parsed
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        const errorMessage = errorResponse.message || `HTTP error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    return response.json(); // Return the parsed JSON body
};
