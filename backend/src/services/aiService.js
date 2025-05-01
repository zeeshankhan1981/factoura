const axios = require('axios');
const logger = require('../utils/logger');

class AIService {
    constructor() {
        this.ollamaBaseUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
        this.models = {
            phi3: 'phi3:3.8b',
            gemma3: 'gemma3:1b'
        };
    }

    async generate(prompt, model = 'phi3') {
        try {
            const response = await axios.post(`${this.ollamaBaseUrl}/generate`, {
                model: this.models[model],
                prompt: prompt,
                stream: false
            });
            return response.data;
        } catch (error) {
            logger.error('AI generation error:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    async analyzeContent(content, model = 'phi3') {
        const prompt = `Analyze the following content for sentiment, bias, and key points:\n\n${content}`;
        return this.generate(prompt, model);
    }

    async factCheck(claim, model = 'phi3') {
        const prompt = `Verify the following claim and provide evidence:\n\n${claim}`;
        return this.generate(prompt, model);
    }

    async summarize(content, model = 'gemma3') {
        const prompt = `Summarize the following content in 3-5 key points:\n\n${content}`;
        return this.generate(prompt, model);
    }

    async quickCheck(claim, model = 'gemma3') {
        const prompt = `Quickly verify this claim (true/false/uncertain):\n\n${claim}`;
        return this.generate(prompt, model);
    }
}

module.exports = new AIService(); 