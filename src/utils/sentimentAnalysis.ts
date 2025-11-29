// src/utils/sentimentAnalysis.ts
export interface EmotionScore {
label: string;
score: number;
}

export interface SentimentResult {
  mood: string;
  confidence: number;
  fineEmotions: EmotionScore[];
  sarcastic?: boolean;
  sarcasticConfidence?: number;
}

export type AnalyzedMood = 
  | 'happy' | 'excited' | 'energetic' | 'content' | 'calm'
  | 'sad' | 'anxious' | 'angry' | 'irritated' | 'frustrated'
  | 'neutral';// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY as string

const EMOTION_MODEL = 'j-hartmann/emotion-english-distilroberta-base';
const SARCASM_MODEL = 'helinivan/english-sarcasm-detector';

// API call helper
async function callHuggingFaceAPI(modelName: string, text: string, retries = 3): Promise<any> {
  const url = `${HF_API_URL}/${modelName}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HF API Error (attempt ${attempt}):`, response.status, errorText);
        
        if (response.status === 503 && attempt < retries) {
          console.log(`Model loading, retrying in ${attempt * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ ${modelName} API response:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed for ${modelName}:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
}

// Analyze emotions using Hugging Face API
async function analyzeEmotions(text: string): Promise<EmotionScore[]> {
  try {
    const result = await callHuggingFaceAPI(EMOTION_MODEL, text);
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0].map((emotion: any) => ({
        label: emotion.label.toLowerCase(),
        score: emotion.score
      })).sort((a: EmotionScore, b: EmotionScore) => b.score - a.score);
    }
    
    throw new Error('Unexpected response format from emotion model');
  } catch (error) {
    console.error('❌ Emotion analysis failed:', error);
    
    return [
      { label: 'neutral', score: 0.7 },
      { label: 'joy', score: 0.15 },
      { label: 'sadness', score: 0.15 }
    ];
  }
}

// Detect sarcasm using Hugging Face API
async function detectSarcasm(text: string): Promise<{ sarcastic: boolean; confidence: number }> {
  try {
    const result = await callHuggingFaceAPI(SARCASM_MODEL, text);
    
    if (Array.isArray(result) && result.length > 0) {
      const scores = result[0];
      
      const sarcasticScore = scores.find((s: any) => 
        s.label.toLowerCase().includes('sarcastic') && !s.label.toLowerCase().includes('not')
      );
      
      if (sarcasticScore) {
        return {
          sarcastic: sarcasticScore.score > 0.5,
          confidence: sarcasticScore.score
        };
      }
      
      const topScore = scores[0];
      return {
        sarcastic: topScore.label.toLowerCase().includes('sarcastic'),
        confidence: topScore.score
      };
    }
    
    throw new Error('Unexpected response format from sarcasm model');
  } catch (error) {
    console.error('❌ Sarcasm detection failed:', error);
    return { sarcastic: false, confidence: 0.5 };
  }
}

// Main sentiment analysis function
export async function analyzeText(text: string): Promise<SentimentResult> {
  console.log('🚀 Starting sentiment analysis for:', text.substring(0, 100) + '...');
  
  if (!text || text.trim().length < 10) {
    throw new Error('Text is too short for analysis');
  }
  
  if (!HF_API_KEY || HF_API_KEY === 'your-api-key-here') {
    console.error('❌ Hugging Face API key not configured');
    throw new Error('Hugging Face API key not configured. Please set REACT_APP_HUGGING_FACE_API_KEY environment variable.');
  }

  try {
    const [emotions, sarcasmResult] = await Promise.all([
      analyzeEmotions(text),
      detectSarcasm(text)
    ]);

    console.log('📊 Raw emotions:', emotions);
    console.log('🤔 Sarcasm result:', sarcasmResult);

    const result: SentimentResult = {
      mood: emotions[0].label,
      confidence: emotions[0].score,
      fineEmotions: emotions,
      sarcastic: sarcasmResult.sarcastic,
      sarcasticConfidence: sarcasmResult.confidence
    };

    console.log('✅ Final analysis result:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Sentiment analysis failed:', error);
    
    return {
      mood: 'neutral',
      confidence: 0.5,
      fineEmotions: [
        { label: 'neutral', score: 0.5 },
        { label: 'unknown', score: 0.3 },
        { label: 'error', score: 0.2 }
      ],
      sarcastic: false,
      sarcasticConfidence: 0.5
    };
  }
}

// Test function for debugging
export async function testSentimentAnalysis() {
  const testTexts = [
    "I'm so happy and excited today! Everything is going wonderfully!",
    "I feel incredibly sad and depressed. Nothing seems to be going right.",
    "I'm really angry about this situation. It's completely unfair!",
    "Oh great, another Monday morning. Just what I needed.", // Sarcastic
    "I'm feeling pretty neutral about everything today."
  ];

  console.log('🧪 Testing sentiment analysis...');
  
  for (const text of testTexts) {
    try {
      console.log(`\nTesting: "${text}"`);
      const result = await analyzeText(text);
      console.log(`Result: ${result.mood} (${Math.round(result.confidence * 100)}% confident)${result.sarcastic ? ', sarcastic' : ''}`);
      console.log('Top emotions:', result.fineEmotions.slice(0, 3).map(e => `${e.label} (${Math.round(e.score * 100)}%)`).join(', '));
    } catch (error) {
      console.error(`❌ Test failed for: "${text}"`, error);
    }
  }
}

// Helper function to check if API is configured
export function isApiConfigured(): boolean {
// ✅ FIX: Use double negation (!!) to ensure a true boolean is always returned.
  return !!(HF_API_KEY && HF_API_KEY !== 'your-api-key-here');
}

// Get API status
export async function getApiStatus(): Promise<{ configured: boolean; working: boolean; error?: string }> {
  const configured = isApiConfigured();
  
  if (!configured) {
    return {
      configured: false,
      working: false,
      error: 'API key not configured'
    };
  }

  try {
    await analyzeText("This is a test message to check if the API is working.");
    return {
      configured: true,
      working: true
    };
  } catch (error) {
    return {
      configured: true,
      working: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Wrapper functions for JournalScreen compatibility
const moodMapping: { [key: string]: AnalyzedMood } = {
  'joy': 'happy',
  'happy': 'happy',
  'excitement': 'excited',
  'excited': 'excited',
  'neutral': 'neutral',
  'sadness': 'sad',
  'sad': 'sad',
  'fear': 'anxious',
  'anxiety': 'anxious',
  'anxious': 'anxious',
  'anger': 'angry',
  'angry': 'angry',
  'disgust': 'frustrated',
  'irritation': 'irritated',
  'frustration': 'frustrated',
  'confused': 'neutral',
  'love': 'content',
  'surprise': 'excited',
  'relieved': 'calm',
  'calm': 'calm'
};

export function analyzeSentiment(text: string): AnalyzedMood {
  // Synchronous fallback for immediate mood detection
  // Uses simple keyword matching when API calls are slow
  const lowerText = text.toLowerCase();
  
  // Happy/positive indicators
  if (/happy|great|wonderful|amazing|excellent|love|awesome|fantastic|perfect|brilliant/.test(lowerText)) {
    return 'happy';
  }
  
  if (/excited|thrilled|eager|enthusiastic|pumped|energized|energetic/.test(lowerText)) {
    return 'excited';
  }
  
  if (/calm|peaceful|relaxed|serene|tranquil|at peace|meditative/.test(lowerText)) {
    return 'calm';
  }
  
  if (/content|satisfied|pleased|good|fine|okay|alright/.test(lowerText)) {
    return 'content';
  }
  
  // Negative indicators
  if (/sad|unhappy|depressed|down|miserable|heartbroken|devastated/.test(lowerText)) {
    return 'sad';
  }
  
  if (/angry|furious|rage|mad|outraged|livid|hostile/.test(lowerText)) {
    return 'angry';
  }
  
  if (/anxious|nervous|worried|stressed|panicked|terrified|scared/.test(lowerText)) {
    return 'anxious';
  }
  
  if (/frustrated|annoyed|irritated|bothered|upset|agitated/.test(lowerText)) {
    return 'irritated';
  }
  
  if (/exhausted|drained|overwhelmed|burnt out|tired|weary/.test(lowerText)) {
    return 'frustrated';
  }
  
  // Energetic
  if (/energetic|dynamic|vigorous|lively|active|bouncy|hyper/.test(lowerText)) {
    return 'energetic';
  }
  
  // Default to neutral
  return 'neutral';
}

export function getMoodExplanation(text: string, mood: AnalyzedMood): string {
  const explanations: { [key in AnalyzedMood]: string[] } = {
    happy: [
      "Your writing shows positive energy and joy! 🌟",
      "I can see happiness radiating from your words.",
      "Your mood seems uplifted and cheerful! ✨"
    ],
    excited: [
      "You're bursting with excitement and enthusiasm! 🚀",
      "Your words show genuine excitement and anticipation.",
      "I sense vibrant energy and eagerness in your message! ⚡"
    ],
    energetic: [
      "Your text radiates dynamic energy and vitality! 💪",
      "You're full of drive and motivation right now.",
      "I detect strong, active energy in your writing! ⚡"
    ],
    content: [
      "You seem satisfied and at peace with things. 😌",
      "Your mood reflects contentment and acceptance.",
      "There's a sense of satisfaction in your words. ☺️"
    ],
    calm: [
      "Your writing conveys serenity and tranquility. 🧘",
      "You seem relaxed and peacefully centered.",
      "I sense a calm, meditative state in your message. 🕯️"
    ],
    sad: [
      "Your words show sadness. Remember, this feeling is temporary. 💙",
      "I sense melancholy in your writing. It's okay to feel this way.",
      "Your mood seems sorrowful. Consider talking to someone. 💙"
    ],
    anxious: [
      "Your writing suggests worry or nervousness. Try some deep breathing. 🌬️",
      "I detect anxiety in your words. You're not alone in feeling this way.",
      "You seem stressed and concerned. Let's take it one step at a time. 💙"
    ],
    angry: [
      "Your words convey strong frustration and anger. 🔥",
      "I sense genuine upset in your message. It's valid to feel angry.",
      "Your mood shows irritation and strong feelings. 😤"
    ],
    irritated: [
      "You seem bothered and annoyed about something. 😤",
      "I detect frustration in your tone.",
      "Your mood reflects irritation. What's bothering you? 💭"
    ],
    frustrated: [
      "Your writing shows frustration and overwhelm. 😓",
      "I sense you're dealing with challenging feelings right now.",
      "You seem worn out. It's okay to feel this way. 💙"
    ],
    neutral: [
      "Your mood seems neutral or reflective. 🤔",
      "I don't detect strong emotions in your message.",
      "Your writing is measured and thoughtful. 💭"
    ]
  };

  const options = explanations[mood];
  return options[Math.floor(Math.random() * options.length)];
}