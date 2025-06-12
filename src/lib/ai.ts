import { showToast } from '../components/Toaster';

// HuggingFace API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HF_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

// Accessibility features mapping (from ReviewPage.tsx)
const ACCESSIBILITY_FEATURES = [
  {
    id: 'wheelchair-accessible',
    name: 'Wheelchair Accessible',
    keywords: ['wheelchair', 'ramp', 'accessible', 'mobility', 'wide door', 'elevator', 'lift']
  },
  {
    id: 'audio-cues',
    name: 'Audio Cues',
    keywords: ['audio', 'sound', 'announcement', 'voice', 'speaking', 'hearing', 'audible']
  },
  {
    id: 'visual-aids',
    name: 'Visual Aids',
    keywords: ['braille', 'visual', 'sign', 'contrast', 'large text', 'bright', 'clear']
  },
  {
    id: 'automatic-doors',
    name: 'Automatic Doors',
    keywords: ['automatic door', 'push button', 'sensor door', 'motion door', 'hands-free']
  },
];

/**
 * Suggests accessibility features based on user comments using AI
 * @param comments - The user's review comments
 * @returns Promise<string[]> - Array of suggested feature IDs
 */
export const suggestAccessibilityFeatures = async (comments: string): Promise<string[]> => {
  console.log('AI: Starting accessibility feature suggestion for comments:', comments);
  
  if (!comments || comments.trim().length < 10) {
    console.log('AI: Comments too short for meaningful analysis');
    return [];
  }

  if (!HF_API_KEY) {
    console.warn('AI: HuggingFace API key not configured');
    showToast('warning', 'AI suggestions unavailable - API key not configured');
    return [];
  }

  try {
    // Prepare candidate labels for zero-shot classification
    const candidateLabels = ACCESSIBILITY_FEATURES.map(feature => feature.name);
    console.log('AI: Using candidate labels:', candidateLabels);

    // Prepare the request payload
    const payload = {
      inputs: comments,
      parameters: {
        candidate_labels: candidateLabels,
        multi_label: true, // Allow multiple labels to be predicted
      }
    };

    console.log('AI: Sending request to HuggingFace API...');
    
    // Make the API request
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI: HuggingFace API error:', response.status, errorText);
      
      if (response.status === 503) {
        showToast('info', 'AI model is loading, please try again in a moment');
      } else if (response.status === 401) {
        showToast('error', 'AI service authentication failed');
      } else {
        showToast('error', 'AI suggestion service temporarily unavailable');
      }
      return [];
    }

    const result = await response.json();
    console.log('AI: HuggingFace API response:', result);

    // Process the results
    const suggestions: string[] = [];
    const confidenceThreshold = 0.3; // Adjust this threshold as needed

    if (result.labels && result.scores) {
      for (let i = 0; i < result.labels.length; i++) {
        const label = result.labels[i];
        const score = result.scores[i];
        
        console.log(`AI: Label "${label}" has confidence score: ${score}`);
        
        if (score >= confidenceThreshold) {
          // Find the corresponding feature ID
          const feature = ACCESSIBILITY_FEATURES.find(f => f.name === label);
          if (feature) {
            suggestions.push(feature.id);
            console.log(`AI: Suggesting feature: ${feature.id} (${label}) with confidence ${score}`);
          }
        }
      }
    }

    // Fallback: Simple keyword matching if AI doesn't return good results
    if (suggestions.length === 0) {
      console.log('AI: No high-confidence suggestions, falling back to keyword matching');
      const keywordSuggestions = getKeywordBasedSuggestions(comments);
      suggestions.push(...keywordSuggestions);
    }

    console.log('AI: Final suggestions:', suggestions);
    return suggestions;

  } catch (error) {
    console.error('AI: Error calling HuggingFace API:', error);
    
    // Fallback to keyword-based suggestions
    console.log('AI: Falling back to keyword-based suggestions due to API error');
    const keywordSuggestions = getKeywordBasedSuggestions(comments);
    
    if (keywordSuggestions.length > 0) {
      showToast('info', 'Using keyword-based suggestions (AI temporarily unavailable)');
      return keywordSuggestions;
    } else {
      showToast('error', 'Unable to generate accessibility suggestions');
      return [];
    }
  }
};

/**
 * Fallback function for keyword-based feature suggestions
 * @param comments - The user's review comments
 * @returns string[] - Array of suggested feature IDs
 */
const getKeywordBasedSuggestions = (comments: string): string[] => {
  const lowerComments = comments.toLowerCase();
  const suggestions: string[] = [];

  ACCESSIBILITY_FEATURES.forEach(feature => {
    const hasKeyword = feature.keywords.some(keyword => 
      lowerComments.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      suggestions.push(feature.id);
      console.log(`AI: Keyword match for feature: ${feature.id}`);
    }
  });

  return suggestions;
};

/**
 * Get a human-readable explanation of why features were suggested
 * @param suggestedFeatures - Array of suggested feature IDs
 * @param comments - The original comments
 * @returns string - Explanation text
 */
export const getAISuggestionExplanation = (suggestedFeatures: string[], comments: string): string => {
  if (suggestedFeatures.length === 0) {
    return "No accessibility features were detected in your comments.";
  }

  const featureNames = suggestedFeatures.map(id => {
    const feature = ACCESSIBILITY_FEATURES.find(f => f.id === id);
    return feature ? feature.name : id;
  });

  if (featureNames.length === 1) {
    return `Based on your comments, we detected mentions of: ${featureNames[0]}`;
  } else if (featureNames.length === 2) {
    return `Based on your comments, we detected mentions of: ${featureNames[0]} and ${featureNames[1]}`;
  } else {
    const lastFeature = featureNames.pop();
    return `Based on your comments, we detected mentions of: ${featureNames.join(', ')}, and ${lastFeature}`;
  }
};