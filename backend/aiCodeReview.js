const  { GoogleGenAI }=require("@google/genai");
const dotenv=require("dotenv");

const ai = new GoogleGenAI({ apiKey:process.env.GEMINI_API_KEY });
const aiCodeReview = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Directly give the answer. No optimized solutions or unnecessary explanations. Perform exactly two tasks: 1) Rate the code below on a scale of 10(mention in score that score is x/10, else user wont know what is the scale) based on real-world coding practices. This includes factors like modularity, readability, variable naming, commenting, flexibility, and error handling. 2) First, appreciate the code by stating its strengths in a concise and friendly way. Then, list the key improvements needed to make it 10/10 code. Use numbered points instead of bullets for both pros and improvements. Keep the explanation for each point short but clear (mention the reason in brackets when needed). Avoid Markdown formatting like stars or bold symbols since this will be displayed in a plain textarea. Keep the overall response to the point, clean, readable, and structured.,
        Code:${code}`
    });
  console.log(response.text);
  return response.text;
 
};

module.exports = {aiCodeReview };

