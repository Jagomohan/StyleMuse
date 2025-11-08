import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UserProfile, Outfit, StyleSuggestion, AccessorySuggestion } from '../types';

// FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
};

// Helper to clean and parse JSON from model responses
const parseJsonResponse = <T>(text: string): T => {
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring('```json'.length).trim();
    }
    if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring('```'.length).trim();
    }
    if (jsonText.endsWith('```')) {
        jsonText = jsonText.substring(0, jsonText.length - '```'.length).trim();
    }
    
    try {
        const parsedData = JSON.parse(jsonText);
        // Handle cases where the model wraps the array in a root object key
        if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) {
            const keys = Object.keys(parsedData);
            if (keys.length === 1 && Array.isArray((parsedData as any)[keys[0]])) {
                return (parsedData as any)[keys[0]];
            }
            // Handle { "products": [...] } case
            if (keys.includes('products') && Array.isArray((parsedData as any).products)) {
                 return parsedData as T;
            }
        }
        return parsedData;
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", jsonText, e);
        throw new Error("The AI response could not be processed. Please try again.");
    }
};

export const getStyleSuggestions = async (userImageBase64: string, occasion: string): Promise<StyleSuggestion[]> => {
    const model = 'gemini-2.5-pro';
    const userImagePart = fileToGenerativePart(userImageBase64.split(',')[1], userImageBase64.split(';')[0].split(':')[1]);

    const prompt = `
      You are StyleMuse, a professional AI fashion stylist. Analyze the provided user photo.
      The user has specified the occasion is: "${occasion}".
      Based on their apparent style, body type, the photo's context, and the specified occasion, generate 3 distinct, high-level fashion style suggestions.
      For each suggestion, provide a name, a short description, and keywords for a style profile (do NOT include 'occasion').
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "A catchy name for the style, relevant to the occasion." },
                    description: { type: Type.STRING, description: "A short, inspiring one-sentence description." },
                    keywords: {
                      type: Type.OBJECT,
                      description: "Keywords to pre-fill a user profile form. Do NOT include 'occasion'.",
                      properties: {
                        vibe: { type: Type.STRING },
                        colorsOrMaterials: { type: Type.STRING },
                        styleInspirations: { type: Type.STRING },
                      },
                      required: ['vibe', 'colorsOrMaterials', 'styleInspirations']
                    },
                  },
                  required: ['name', 'description', 'keywords']
                },
            },
        },
    });

    const suggestionsData = parseJsonResponse<StyleSuggestion[]>(response.text);
    return suggestionsData;
};

export const getOutfitIdeas = async (userImageBase64: string, profile: UserProfile): Promise<Outfit[]> => {
    const model = 'gemini-2.5-pro';
    const userImagePart = fileToGenerativePart(userImageBase64.split(',')[1], userImageBase64.split(';')[0].split(':')[1]);

    const prompt = `
        You are StyleMuse, a professional AI fashion stylist specializing in virtual try-on.
        
        **User Preferences:**
        - **Occasion:** ${profile.occasion}
        - **Vibe:** ${profile.vibe}
        - **Preferred Colors/Materials:** ${profile.colorsOrMaterials || 'None specified'}
        - **Style Inspirations:** ${profile.styleInspirations || 'None specified'}
        - **Budget:** ${profile.budget}

        **Task:**
        Analyze the user's photo and preferences. Use Google Search for current trends.
        Generate 3 distinct outfit concepts.
        Return ONLY a valid JSON array of 3 objects.
        Each object must have these exact keys:
        1. "name": (string) A creative name for the look (e.g., "Monochromatic Power Suit").
        2. "explanation": (string) A detailed explanation of why this outfit works for the user, including specific pieces and 2-3 styling tips.
        3. "editPrompt": (string) A detailed, direct instruction for the 'gemini-2.5-flash-image' model. This prompt should instruct the model to *replace the clothing* on the person in the original photo with the new outfit described in the 'explanation'. It must explicitly say to keep the person's face, body, and the background intact as much as possible.
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const outfitIdeas = parseJsonResponse<Outfit[]>(response.text);

    if (!Array.isArray(outfitIdeas)) {
        console.error("Parsed response is not an array:", outfitIdeas);
        throw new Error("AI response did not contain a valid list of outfits.");
    }
    
    return outfitIdeas;
};


export const generateSuggestionImage = async (prompt: string): Promise<string> => {
    if (!prompt || prompt.trim() === '') {
        console.error("Attempted to generate image with an empty prompt.");
        throw new Error("Cannot generate image: The image prompt is empty.");
    }

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to return an image.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
};

export const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    if (!prompt || prompt.trim() === '') {
        console.error("Attempted to edit image with an empty prompt.");
        throw new Error("Cannot edit image: The edit prompt is empty.");
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("Could not find edited image in the response.");
};

export const getAccessorySuggestions = async (lookName: string, explanation: string): Promise<AccessorySuggestion[]> => {
    // Fix: Use gemini-2.5-flash for basic text tasks as per guidelines for better performance and cost.
    const model = 'gemini-2.5-flash';
    const prompt = `
        You are an expert fashion stylist. I have an outfit called '${lookName}' which is described as '${explanation}'.
        Suggest 3 accessories (e.g., handbag, shoes, jewelry, scarf) that would perfectly complement this look.
        For each suggestion, provide a name and a brief description of why it works with the outfit.
    `;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: prompt }] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the accessory (e.g., 'Gold Layered Necklace')." },
                        description: { type: Type.STRING, description: "A brief explanation of why this accessory is a good choice for the outfit." }
                    },
                    required: ['name', 'description']
                }
            }
        }
    });

    const suggestions = parseJsonResponse<AccessorySuggestion[]>(response.text);

    if (!Array.isArray(suggestions)) {
        console.error("Parsed accessory response is not an array:", suggestions);
        throw new Error("AI response did not contain a valid list of accessories.");
    }
    
    return suggestions;
};