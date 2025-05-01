import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CONTENT_ANALYSIS_SERVICE_URL = process.env.CONTENT_ANALYSIS_SERVICE_URL || 'http://localhost:5002';

async function testPythonService() {
  try {
    console.log(`Testing connection to Python service at ${CONTENT_ANALYSIS_SERVICE_URL}...`);
    
    // Test health endpoint
    const healthResponse = await axios.get(`${CONTENT_ANALYSIS_SERVICE_URL}/health`);
    console.log('Health check response:', healthResponse.data);
    
    // Test sentiment analysis
    const sampleText = "Blockchain technology is revolutionizing journalism by providing a transparent and immutable record of information. This innovation helps combat misinformation and builds trust with readers.";
    
    const sentimentResponse = await axios.post(`${CONTENT_ANALYSIS_SERVICE_URL}/analyze/sentiment`, {
      text: sampleText,
      title: "Blockchain in Journalism",
      options: {}
    });
    
    console.log('Sentiment analysis response:');
    console.log('- Emotional tone:', sentimentResponse.data.emotional_tone);
    console.log('- Emotional intensity:', sentimentResponse.data.emotional_intensity);
    console.log('- Objectivity score:', sentimentResponse.data.objectivity_score);
    
    // Test tag generation
    const tagResponse = await axios.post(`${CONTENT_ANALYSIS_SERVICE_URL}/generate-tags`, {
      text: sampleText,
      title: "Blockchain in Journalism",
      existing_tags: [],
      max_tags: 5
    });
    
    console.log('Tag generation response:');
    console.log('- Suggested tags:', tagResponse.data.suggested_tags.map(tag => tag.tag).join(', '));
    
    console.log('\n✅ Python service is working correctly!');
    
  } catch (error) {
    console.error('Error testing Python service:');
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Request error - no response received');
    } else {
      console.error('Error:', error.message);
    }
    console.error('\n❌ Python service test failed');
  }
}

testPythonService();
