import { genAI } from "../services/gemiservices.js";


export const getFeedback =async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an ATS (Applicant Tracking System) resume analyzer. 
Analyze the following resume text and respond ONLY with a **valid JSON object**.
Do not include explanations or extra text.  

JSON format to follow:
{
  "ATS Score": number,  
  "Strengths": ["list of strengths"],  
  "Weaknesses": ["list of weaknesses"],  
  "Suggestions": ["list of suggestions"],  
  "Extracted Skills": ["list of skills"],  
  "Summary": "short summary of candidate profile"  
}

Resume Text:
${text}
              `,
            },
          ],
        },
      ],
    });

    let rawResponse = result.response.text().trim();

    // Try parsing JSON (clean if Gemini adds markdown or ```json)
    rawResponse = rawResponse.replace(/```json|```/g, "");
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", rawResponse);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    res.json(parsed); // send structured JSON to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
