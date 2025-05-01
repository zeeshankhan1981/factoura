import React, { useState } from 'react';
import axios from 'axios';

const ArticleAnalysis = ({ articleContent, articleTitle }) => {
  const [sentiment, setSentiment] = useState(null);
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sentiment');
  const [error, setError] = useState(null);

  const analyzeArticle = async () => {
    if (!articleContent) {
      setError("No article content to analyze");
      return;
    }
    
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    try {
      // Get sentiment analysis
      const sentimentResponse = await axios.post(
        'http://localhost:5001/api/analysis/sentiment',
        { 
          text: articleContent,
          title: articleTitle 
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSentiment(sentimentResponse.data);
      
      // Get tag suggestions
      const tagsResponse = await axios.post(
        'http://localhost:5001/api/analysis/tags',
        { 
          text: articleContent,
          title: articleTitle 
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setTags(tagsResponse.data);
      
    } catch (error) {
      console.error('Error analyzing article:', error);
      setError("Failed to analyze article. Python analysis service may not be running.");
    } finally {
      setLoading(false);
    }
  };

  const renderSentiment = () => {
    if (!sentiment) return <p className="text-gray-600">No sentiment analysis available. Click "Analyze Article" to begin.</p>;
    
    const { overall_sentiment, emotional_tone, emotional_intensity, objectivity_score } = sentiment;
    
    // Determine sentiment class for styling
    let sentimentClass = 'bg-gray-100 text-gray-600'; // neutral
    let fillColor = 'bg-gray-400'; // neutral
    if (overall_sentiment.compound_score > 0.2) {
      sentimentClass = 'bg-green-50 text-green-700';
      fillColor = 'bg-green-500';
    } else if (overall_sentiment.compound_score < -0.2) {
      sentimentClass = 'bg-red-50 text-red-700';
      fillColor = 'bg-red-500';
    }
    
    return (
      <div className="flex flex-col gap-6">
        <div className={`text-center p-4 rounded-lg ${sentimentClass}`}>
          <h3 className="m-0 mb-4 text-2xl font-medium">{emotional_tone}</h3>
          <div className="h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${fillColor}`}
              style={{ width: `${Math.abs(overall_sentiment.compound_score * 100)}%` }}
            ></div>
          </div>
          <p className="text-sm">Sentiment Score: {overall_sentiment.compound_score.toFixed(2)}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Emotional Intensity:</span>
            <span className="font-medium text-gray-800">{emotional_intensity.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Objectivity Score:</span>
            <span className="font-medium text-gray-800">{objectivity_score.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Positive Elements:</span>
            <span className="font-medium text-gray-800">{(overall_sentiment.positive * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Negative Elements:</span>
            <span className="font-medium text-gray-800">{(overall_sentiment.negative * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        {sentiment.sentence_analysis && sentiment.sentence_analysis.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-2 text-gray-800 font-medium">Key Emotional Sentences</h4>
            <ul className="list-none p-0 m-0">
              {sentiment.sentence_analysis.map((sentence, index) => {
                let sentenceClass = "border-l-4 border-gray-400"; // neutral
                if (sentence.compound_score > 0.2) {
                  sentenceClass = "border-l-4 border-green-500"; // positive
                } else if (sentence.compound_score < -0.2) {
                  sentenceClass = "border-l-4 border-red-500"; // negative
                }
                return (
                  <li key={index} className={`${sentenceClass} p-3 mb-2 rounded bg-gray-50`}>
                    {sentence.text}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTags = () => {
    if (!tags) return <p className="text-gray-600">No tag suggestions available. Click "Analyze Article" to begin.</p>;
    
    return (
      <div className="flex flex-col gap-6">
        <div className="mb-4">
          <h4 className="m-0 mb-3 text-gray-800 font-medium">Suggested Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.suggested_tags.map((tag, index) => {
              // Determine tag styling based on type
              let tagClass = "bg-blue-100 text-blue-700"; // default
              
              // Adjust font size based on relevance
              const fontSize = `${Math.max(0.8, Math.min(1.5, tag.relevance + 0.8))}em`;
              
              return (
                <span 
                  key={index} 
                  className={`inline-block px-3 py-1 rounded-full text-sm ${tagClass}`}
                  style={{ fontSize }}
                >
                  {tag.tag}
                </span>
              );
            })}
          </div>
        </div>
        
        {tags.categorized_tags.entities.length > 0 && (
          <div className="mb-4">
            <h4 className="m-0 mb-3 text-gray-800 font-medium">Entities</h4>
            <div className="flex flex-wrap gap-2">
              {tags.categorized_tags.entities.map((tag, index) => {
                // Determine entity tag styling based on entity_type
                let tagClass = "bg-green-100 text-green-700"; // default for entity
                
                if (tag.entity_type.toLowerCase() === 'person') {
                  tagClass = "bg-green-100 text-green-700";
                } else if (tag.entity_type.toLowerCase() === 'org') {
                  tagClass = "bg-amber-100 text-amber-700";
                } else if (tag.entity_type.toLowerCase() === 'gpe' || tag.entity_type.toLowerCase() === 'loc') {
                  tagClass = "bg-blue-100 text-blue-700";
                }
                
                return (
                  <span key={index} className={`inline-block px-3 py-1 rounded-full text-sm ${tagClass}`}>
                    {tag.tag} <small className="opacity-70 text-xs">({tag.entity_type})</small>
                  </span>
                );
              })}
            </div>
          </div>
        )}
        
        {tags.categorized_tags.keywords.length > 0 && (
          <div className="mb-4">
            <h4 className="m-0 mb-3 text-gray-800 font-medium">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {tags.categorized_tags.keywords.map((tag, index) => (
                <span key={index} className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48 text-gray-600">Analyzing article...</div>;
    }
    
    if (error) {
      return <div className="text-red-600 p-4 bg-red-50 rounded my-4">{error}</div>;
    }
    
    switch (activeTab) {
      case 'sentiment':
        return renderSentiment();
      case 'tags':
        return renderTags();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="m-0 text-lg text-gray-800">Article Analysis</h3>
        <button 
          className={`py-2 px-4 rounded text-sm transition-colors ${
            loading || !articleContent 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
          }`}
          onClick={analyzeArticle}
          disabled={loading || !articleContent}
        >
          {loading ? 'Analyzing...' : 'Analyze Article'}
        </button>
      </div>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-3 px-6 text-sm transition-all border-b-2 ${
            activeTab === 'sentiment' 
              ? 'text-blue-600 border-blue-600 font-medium' 
              : 'text-gray-600 border-transparent hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('sentiment')}
        >
          Sentiment Analysis
        </button>
        <button 
          className={`py-3 px-6 text-sm transition-all border-b-2 ${
            activeTab === 'tags' 
              ? 'text-blue-600 border-blue-600 font-medium' 
              : 'text-gray-600 border-transparent hover:text-blue-600'
          }`}
          onClick={() => setActiveTab('tags')}
        >
          Tag Suggestions
        </button>
      </div>
      
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ArticleAnalysis;
