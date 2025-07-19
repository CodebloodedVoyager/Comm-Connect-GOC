import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create a comprehensive prompt for summarization
    const prompt = `Please provide a comprehensive and well-structured summary of the following text. 

Instructions:
- Create a clear, concise summary that captures the main points
- Use bullet points or numbered lists where appropriate
- Maintain the key insights and important details
- Keep the summary between 150-300 words depending on the original length
- Use professional and clear language
- Structure the summary with headings if the content is complex

Text to summarize:
${text}`

    // Generate the summary
    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return NextResponse.json({
      summary: summary.trim(),
      originalLength: text.length,
      summaryLength: summary.length,
      compressionRatio: Math.round((1 - summary.length / text.length) * 100),
    })
  } catch (error) {
    console.error("Gemini API error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        return NextResponse.json({ error: "Invalid API key configuration" }, { status: 401 })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "API quota exceeded. Please try again later." }, { status: 429 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate summary. Please try again.",
      },
      { status: 500 },
    )
  }
}
