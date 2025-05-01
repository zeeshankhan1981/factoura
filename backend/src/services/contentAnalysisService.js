/*
 * Copyright (c) 2025 factoura.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CONTENT_ANALYSIS_SERVICE_URL = process.env.CONTENT_ANALYSIS_SERVICE_URL || 'http://localhost:5002';

class ContentAnalysisService {
  constructor() {
    this.serviceUrl = CONTENT_ANALYSIS_SERVICE_URL;
    this.isServiceAvailable = true;
    
    // Check if the service is available
    this.checkServiceAvailability();
  }

  async checkServiceAvailability() {
    try {
      const response = await axios.get(`${this.serviceUrl}/`);
      this.isServiceAvailable = response.status === 200;
      console.log(`factoura. Content Analysis Service is ${this.isServiceAvailable ? 'available' : 'unavailable'}`);
    } catch (error) {
      this.isServiceAvailable = false;
      console.error('factoura. Content Analysis Service is unavailable:', error.message);
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.serviceUrl}/health`);
      return {
        status: 'available',
        pythonService: response.data,
        serviceUrl: this.serviceUrl
      };
    } catch (error) {
      console.error('Error checking Python service health:', error.message);
      return {
        status: 'unavailable',
        error: error.message,
        serviceUrl: this.serviceUrl
      };
    }
  }

  async analyzeSentiment(text, title = null) {
    if (!this.isServiceAvailable) {
      console.warn('factoura. Content Analysis Service is unavailable. Skipping sentiment analysis.');
      return null;
    }

    try {
      const response = await axios.post(`${this.serviceUrl}/analyze/sentiment`, {
        text,
        title,
        options: {}
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error.message);
      return null;
    }
  }

  async generateTags(text, title = null, existingTags = [], maxTags = 10) {
    if (!this.isServiceAvailable) {
      console.warn('factoura. Content Analysis Service is unavailable. Skipping tag generation.');
      return null;
    }

    try {
      const response = await axios.post(`${this.serviceUrl}/generate-tags`, {
        text,
        title,
        existing_tags: existingTags,
        max_tags: maxTags
      });
      return response.data;
    } catch (error) {
      console.error('Error generating tags:', error.message);
      return null;
    }
  }
}

const contentAnalysisService = new ContentAnalysisService();
export default contentAnalysisService;
