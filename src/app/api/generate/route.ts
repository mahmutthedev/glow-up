import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable not set");
}

const PROMPTS = [
  "A candid, photorealistic shot of this person, who has an {athleticism} build, laughing at a rooftop bar at sunset. The focus is solely on them, looking natural and fun. No other people. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "A realistic photo of this person, with an {athleticism} physique, hiking on a scenic mountain trail, looking adventurous and happy. Golden hour lighting. The focus is only on them. Animals are allowed. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "Create a photo of this person, with an {athleticism} build, focused on a hobby, like playing a guitar in a cozy room. The atmosphere is passionate and creative. The person is the only one in the image. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "Generate an image of this person, with an {athleticism} body type, volunteering at an animal shelter, smiling while petting a dog. The shot looks heartwarming and genuine. No other people visible. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "A photorealistic image of this person, who has an {athleticism} build, in a stylish cafe, reading a book. The vibe is intelligent, relaxed, and sophisticated. They are the sole focus. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "A high-quality, realistic photo of this person with an {athleticism} build, dressed smartly at an art gallery, looking thoughtfully at a painting. Soft, artistic lighting. They are the only person in the shot. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "Generate a photorealistic image of this person, with an {athleticism} physique, laughing while cooking in a bright, modern kitchen. The atmosphere is joyful and domestic. The focus is entirely on them. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "A candid shot of this person, who has an {athleticism} build, walking through a vibrant city street at night. City lights create a beautiful bokeh effect. They look confident and happy, and are the only person in focus. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "Create a photo of this person, with an {athleticism} body type, enjoying a picnic in a park on a sunny day, smiling at the camera. An adorable pet can be next to them. No other people. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
  "A photorealistic portrait of this person, with an {athleticism} build, sitting by a cozy fireplace with a mug. The setting is warm and inviting, with a relaxed expression. This must be a solo portrait. Crucially, maintain the person's exact facial features, ethnicity, and hairstyle from the original photo for character consistency.",
];

async function generateSingleImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  try {
    console.log('Making API request to OpenRouter...');
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Profile Picture Pro",
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-image-preview:free",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:${mimeType};base64,${base64ImageData}`
                }
              },
              {
                "type": "text",
                "text": `Generate an image: ${prompt}. Return only the generated image, no text description.`
              }
            ]
          }
        ],
        "response_format": {
          "type": "image"
        },
        "max_tokens": 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      firstChoiceKeys: data.choices?.[0] ? Object.keys(data.choices[0]) : null
    });
    
    // Check for OpenRouter response format with images array
    if (data.choices && data.choices[0]) {
      const choice = data.choices[0];
      
      // Check for images array in the message (OpenRouter format)
      if (choice.message && choice.message.images && choice.message.images.length > 0) {
        const imageData = choice.message.images[0];
        if (imageData.image_url && imageData.image_url.url) {
          console.log('Found image in message.images array');
          return imageData.image_url.url;
        }
      }
      
      // Check for content parts (alternative format)
      if (choice.message && choice.message.content) {
        // Handle string content (fallback)
        if (typeof choice.message.content === 'string') {
          console.log('Content is string:', choice.message.content.substring(0, 100));
          // If the string doesn't look like a URL, it might be a description
          // This means the model didn't generate an image
          if (!choice.message.content.startsWith('data:image') && !choice.message.content.startsWith('http')) {
            throw new Error('Model returned text instead of image. The model may not support image generation.');
          }
          return choice.message.content;
        }
        
        // Handle array of content parts
        if (Array.isArray(choice.message.content)) {
          for (const part of choice.message.content) {
            if (part.type === 'image_url' && part.image_url) {
              return part.image_url.url;
            }
            // Check for inline_data (Google's format)
            if (part.inline_data || part.inlineData) {
              const inlineData = part.inline_data || part.inlineData;
              return `data:${inlineData.mimeType || inlineData.mime_type || 'image/png'};base64,${inlineData.data}`;
            }
          }
        }
      }
      
      // Check for direct inline_data on the choice (alternative format)
      if (choice.inline_data || choice.inlineData) {
        const inlineData = choice.inline_data || choice.inlineData;
        return `data:${inlineData.mimeType || inlineData.mime_type || 'image/png'};base64,${inlineData.data}`;
      }
    }

    console.error('Unexpected response format:', data);
    throw new Error('No image was generated - unexpected response format');
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    throw new Error(`Failed to generate image for prompt: ${prompt}`);
  }
}

const generateProfilePictures = async (base64ImageData: string, mimeType: string, physique: string = "Athletic"): Promise<string[]> => {
  console.log("=== GENERATING PROFILE PICTURES ===");
  console.log(`Generating ${PROMPTS.length} images with prompts`);
  
  const imagePromises = PROMPTS.map((prompt, index) => {
    // Replace {athleticism} placeholder with actual physique
    const finalPrompt = prompt.replace(/\{athleticism\}/g, physique.toLowerCase());
    console.log(`Starting generation ${index + 1}/${PROMPTS.length}: ${finalPrompt.substring(0, 100)}...`);
    return generateSingleImage(base64ImageData, mimeType, finalPrompt);
  });
  
  const results = await Promise.all(imagePromises);
  console.log(`=== SUCCESS! Generated ${results.length} images ===`);
  return results;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check user's credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits. Please sign in again to get more credits." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { imageData, mimeType, physique } = body;

    if (!imageData || !mimeType) {
      return NextResponse.json(
        { error: "Missing imageData or mimeType" },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");

    console.log("=== PROFILE PICTURE GENERATION REQUEST ===");
    console.log("Image data length:", base64Data.length);
    console.log("MIME type:", mimeType);
    console.log("API Key exists:", !!OPENROUTER_API_KEY);

    const generatedImages = await generateProfilePictures(base64Data, mimeType, physique || "Athletic");

    // Deduct 1 credit after successful generation
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
      select: { credits: true }
    });

    // Save the generation to database
    await prisma.photo.create({
      data: {
        userId: session.user.id,
        originalUrl: imageData,
        generatedUrls: generatedImages,
      }
    });

    return NextResponse.json({
      success: true,
      images: generatedImages,
      remainingCredits: updatedUser.credits,
    });
  } catch (error) {
    console.error("Error generating profile pictures:", error);
    return NextResponse.json(
      { error: "Failed to generate profile pictures" },
      { status: 500 }
    );
  }
}