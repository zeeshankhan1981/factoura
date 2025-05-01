# Copyright (c) 2025 factoura.
# Licensed under the MIT License. See LICENSE in the project root for license information.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob
import spacy
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download necessary NLTK data
logger.info("Downloading NLTK data...")
nltk.download('vader_lexicon', quiet=True)
nltk.download('punkt', quiet=True)

# Load SpaCy model - use a smaller model for faster loading
logger.info("Loading SpaCy model...")
try:
    nlp = spacy.load('en_core_web_sm')
except OSError:
    logger.info("Downloading SpaCy model...")
    os.system('python -m spacy download en_core_web_sm')
    nlp = spacy.load('en_core_web_sm')

app = FastAPI(title="factoura. Content Analysis Service")

class ContentAnalysisRequest(BaseModel):
    text: str
    title: Optional[str] = None
    options: dict = {}

class TaggingRequest(BaseModel):
    text: str
    title: Optional[str] = None
    existing_tags: List[str] = []
    max_tags: int = 10

@app.get("/")
def read_root():
    return {"status": "factoura. Content Analysis Service is running"}

@app.get("/health")
def health_check():
    """Health check endpoint to verify service is running"""
    return {
        "status": "healthy",
        "service": "factoura. Content Analysis Service",
        "version": "1.0.0",
        "dependencies": {
            "nltk": "available",
            "spacy": "available",
            "textblob": "available"
        }
    }

@app.post("/analyze/sentiment")
def analyze_sentiment(request: ContentAnalysisRequest):
    """Perform sentiment analysis on journalistic content"""
    logger.info("Processing sentiment analysis request")
    
    # Initialize analyzers
    sia = SentimentIntensityAnalyzer()
    
    # Analyze overall sentiment with VADER
    vader_scores = sia.polarity_scores(request.text)
    
    # Analyze with TextBlob
    blob = TextBlob(request.text)
    textblob_polarity = blob.sentiment.polarity
    textblob_subjectivity = blob.sentiment.subjectivity
    
    # Sentence-level analysis
    sentences = nltk.sent_tokenize(request.text)
    sentence_analysis = []
    
    for sentence in sentences:
        vader_sent_scores = sia.polarity_scores(sentence)
        blob_sent = TextBlob(sentence)
        
        # Only include sentences with strong sentiment
        if abs(vader_sent_scores['compound']) > 0.3:
            sentence_analysis.append({
                "text": sentence,
                "compound_score": vader_sent_scores['compound'],
                "polarity": blob_sent.sentiment.polarity,
                "subjectivity": blob_sent.sentiment.subjectivity,
            })
    
    # Determine emotional tone
    emotional_tone = "Neutral"
    if vader_scores['compound'] >= 0.5:
        emotional_tone = "Very Positive"
    elif vader_scores['compound'] >= 0.05:
        emotional_tone = "Positive"
    elif vader_scores['compound'] <= -0.5:
        emotional_tone = "Very Negative"
    elif vader_scores['compound'] <= -0.05:
        emotional_tone = "Negative"
    
    # Analyze title if provided
    title_analysis = None
    if request.title:
        title_vader = sia.polarity_scores(request.title)
        title_blob = TextBlob(request.title)
        title_analysis = {
            "compound_score": title_vader['compound'],
            "polarity": title_blob.sentiment.polarity,
            "subjectivity": title_blob.sentiment.subjectivity
        }
    
    # Calculate emotional intensity
    emotional_intensity = abs(vader_scores['compound']) * 100  # 0-100 scale
    
    return {
        "overall_sentiment": {
            "compound_score": vader_scores['compound'],
            "positive": vader_scores['pos'],
            "negative": vader_scores['neg'],
            "neutral": vader_scores['neu'],
            "polarity": textblob_polarity,
            "subjectivity": textblob_subjectivity
        },
        "emotional_tone": emotional_tone,
        "emotional_intensity": emotional_intensity,
        "title_sentiment": title_analysis,
        "sentence_analysis": sentence_analysis[:5],  # Limit to 5 sentences for brevity
        "objectivity_score": 100 - (textblob_subjectivity * 100)  # 0-100 scale
    }

@app.post("/generate-tags")
def generate_tags(request: TaggingRequest):
    """Generate intelligent tags for journalistic content"""
    logger.info("Processing tag generation request")
    
    # Combine title and text, giving more weight to the title
    combined_text = request.title + " " + request.title + " " + request.text if request.title else request.text
    
    # Process with spaCy
    doc = nlp(combined_text)
    
    # Extract named entities
    entities = {}
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG", "GPE", "LOC", "PRODUCT", "EVENT", "WORK_OF_ART", "LAW"]:
            # Normalize entity text
            entity_text = ent.text.lower()
            if entity_text not in entities:
                entities[entity_text] = {
                    "text": ent.text,
                    "label": ent.label_,
                    "count": 0
                }
            entities[entity_text]["count"] += 1
    
    # Extract keywords (important tokens)
    keywords = []
    for token in doc:
        if token.is_alpha and not token.is_stop and token.pos_ in ["NOUN", "PROPN", "ADJ"]:
            keywords.append(token.text.lower())
    
    # Count keyword frequency
    keyword_freq = {}
    for keyword in keywords:
        if keyword not in keyword_freq:
            keyword_freq[keyword] = 0
        keyword_freq[keyword] += 1
    
    # Combine all potential tags
    all_tags = []
    
    # Add entity-based tags
    for entity_data in sorted(entities.values(), key=lambda x: x["count"], reverse=True)[:request.max_tags // 2]:
        all_tags.append({
            "tag": entity_data["text"],
            "type": "entity",
            "entity_type": entity_data["label"],
            "relevance": min(entity_data["count"] / 2, 1.0)  # Scale 0-1
        })
    
    # Add keyword-based tags
    for keyword, count in sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:request.max_tags // 2]:
        if keyword not in [tag["tag"].lower() for tag in all_tags]:
            all_tags.append({
                "tag": keyword,
                "type": "keyword",
                "relevance": min(count / 5, 1.0)  # Scale 0-1
            })
    
    # Sort by relevance and limit to max_tags
    final_tags = sorted(all_tags, key=lambda x: x["relevance"], reverse=True)[:request.max_tags]
    
    # Check for overlap with existing tags
    existing_tags_lower = [tag.lower() for tag in request.existing_tags]
    new_tags = [tag for tag in final_tags if tag["tag"].lower() not in existing_tags_lower]
    
    # Categorize tags
    categorized_tags = {
        "entities": [tag for tag in final_tags if tag["type"] == "entity"],
        "keywords": [tag for tag in final_tags if tag["type"] == "keyword"],
    }
    
    return {
        "suggested_tags": final_tags,
        "new_tags": new_tags,
        "categorized_tags": categorized_tags,
        "tag_count": len(final_tags)
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting factoura. Content Analysis Service...")
    uvicorn.run(app, host="0.0.0.0", port=5002)
