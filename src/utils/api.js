/**
 * Fetches medicine suggestions from the NLM Clinical Tables API (RxTerms).
 * Docs: https://clinicaltables.nlm.nih.gov/apidoc/rxterms/v3/doc.html
 * 
 * @param {string} query - The search query for the medicine name.
 * @returns {Promise<Array>} - List of medicine objects with name, strengths, etc.
 */
export const searchMedicines = async (query) => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(
            `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(query)}&ef=STRENGTHS_AND_FORMS,RXCUIS`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        // API returns: [total_count, [names], {field: [values]}]
        // We map this to a more usable format
        const names = data[1] || [];
        const details = data[2] || {};
        const strengths = details['STRENGTHS_AND_FORMS'] || [];

        return names.map((name, index) => ({
            id: index, // The API doesn't give a stable ID for the concept, so we use index for keying in UI
            name: name,
            strengths: strengths[index] || []
        }));

    } catch (error) {
        console.error("Failed to fetch medicines:", error);
        return [];
    }
};
