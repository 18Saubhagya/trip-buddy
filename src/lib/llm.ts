import { OpenAI } from "openai"

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY!,
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Travel Buddy',
    },
});

export async function generateItinerary({cities, startDate, endDate, minBudget, maxBudget, interests, currency} : {
    cities: string[];
    startDate: string;
    endDate: string;
    minBudget: number;
    maxBudget: number;
    interests: string[];
    currency: string;
}) {

    const systemPrompt = `You are a professional travel planner. Your task is to generate detailed day-wise travel itineraries based on user preferences. 
    Always respond only in valid JSON that follows the exact structure provided. Do not include explanations, text, or formatting outside the JSON.`;

    const userPrompt = `
    Generate a day-wise travel itinerary in valid JSON format based on the following preferences:

      - Start Date: ${startDate}
      - End Date: ${endDate}
      - Budget: ${currency} ${minBudget}-${currency} ${maxBudget}
      - Cities: ${cities.join(", ")}
      - Interests: ${interests.join(", ")}

      Requirements:
      - Divide the trip from ${startDate} to ${endDate} into daily entries.
      - Each day must include 2-3 attractions.
      - For every attraction, include:
        - name: Name of the attraction
        - timeToSpend: Suggested time to spend (e.g., "2 hours")
        - address: General or specific location
        - thingsToDo: Key activities or highlights
      - Do not include any text, explanation, or formatting outside of the JSON.

      Output Format (strictly follow this structure):
      {
        "days": [
          {
            "day": 1,
            "places": [
              {
                "name": "PLACE_NAME",
                "timeToSpend": "TIME_STRING",
                "address": "PLACE_ADDRESS",
                "thingsToDo": "DESCRIPTION"
              }
            ]
          }
        ]
      }
    `;

    const completion = await client.chat.completions.create({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            { 
                role: "user", 
                content: userPrompt 
            },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
    })

    console.log("Completion:", completion.choices[0].message);
    console.log("JSON Content:", completion.choices[0].message?.content);
    console.log("meta:", completion.usage);
    
    
    return completion.choices[0].message.content ?? {};

}