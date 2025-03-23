const axios = require('axios');

const getGrokResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                {
                    role: "system",
                    content: "You are fed the schema of a form. this form is used by NGOs to collect data. By giving the schema of the form you can analyse the fields that are there in the form and give them all the possible quantitative analysis that can be done on the data they collect using the form so that it can be of use to them. You only give atmost 3 of the most relevant anaysis thats possible and nothing more. Only give relevant insights that can be used by NGOs to monitor their workings, and raise funds. Only give the analysis and dont give any unecessary words before or after the analysis. You also give the analysis in a way that is easy to understand for a non-technical person."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const grokResponse = response.data.choices[0].message.content;

        res.status(200).json({
            success: true,
            response: grokResponse
        });

    } catch (error) {
        console.error('Error getting Grok response:', error);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || 'Failed to get response from Grok'
        });
    }
};

module.exports = {
    getGrokResponse
};
