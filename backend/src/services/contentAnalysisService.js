/*
 * Copyright (c) 2025 factoura.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import axios from 'axios';
import logger from '../utils/logger.js';
import databaseService from './databaseService.js';

class ContentAnalysisService {
  constructor() {
    this.baseUrl = process.env.CONTENT_ANALYSIS_SERVICE_URL || 'http://localhost:5002';
  }

  async analyzeSentiment(content, articleId = null) {
    try {
      const response = await axios.post(`${this.baseUrl}/analyze/sentiment`, {
        text: content
      });

      if (articleId) {
        await databaseService.updateArticleAnalysis(articleId, {
          sentimentScore: response.data.overall_sentiment.compound_score,
          emotionalTone: response.data.emotional_tone,
          objectivityScore: response.data.objectivity_score
        });

        await databaseService.logAnalysis(
          articleId,
          'content_analysis',
          'success',
          response.data
        );
      }

      return response.data;
    } catch (error) {
      logger.error('Sentiment analysis error:', error);
      
      if (articleId) {
        await databaseService.logAnalysis(
          articleId,
          'content_analysis',
          'error',
          null,
          error.message
        );
      }

      throw new Error('Failed to analyze sentiment');
    }
  }

  async generateTags(content, articleId = null) {
    try {
      const response = await axios.post(`${this.baseUrl}/generate-tags`, {
        text: content
      });

      if (articleId) {
        const tags = response.data.suggested_tags.map(tag => tag.tag);
        await databaseService.updateArticleAnalysis(articleId, {
          tags: tags
        });

        await databaseService.logAnalysis(
          articleId,
          'content_analysis',
          'success',
          response.data
        );
      }

      return response.data;
    } catch (error) {
      logger.error('Tag generation error:', error);
      
      if (articleId) {
        await databaseService.logAnalysis(
          articleId,
          'content_analysis',
          'error',
          null,
          error.message
        );
      }

      throw new Error('Failed to generate tags');
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      logger.error('Content analysis service health check failed:', error);
      return { status: 'unavailable' };
    }
  }
}

const contentAnalysisService = new ContentAnalysisService();
export default contentAnalysisService;
