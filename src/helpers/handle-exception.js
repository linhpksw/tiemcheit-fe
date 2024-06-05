export const handleException = async (response) => {
    if (!response.ok) {
        let errorDetails = `HTTP error ${response.status}: ${response.statusText}`;

        try {
            const errorResponse = await response.json();
            errorDetails += `${errorResponse.message}`;
        } catch (jsonError) {
            console.error(`JSON parsing error: ${jsonError.message}`);
        }
        throw new Error(errorDetails);
    }

    return await response.json(); // Return the parsed JSON body if no error
};
