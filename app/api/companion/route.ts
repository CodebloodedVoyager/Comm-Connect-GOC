import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, conversationType } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create a comprehensive prompt based on conversation type
    let systemPrompt = ""

    switch (conversationType) {
      case "code-review":
        systemPrompt = `You are an expert code reviewer and senior developer. Analyze the provided code and give constructive feedback including:
        - Code quality and best practices
        - Potential bugs or issues
        - Performance optimizations
        - Security considerations
        - Suggestions for improvement
        
        Be thorough but concise, and provide specific examples when possible.`
        break

      case "debug-help":
        systemPrompt = `You are a debugging expert. Help identify and solve programming issues by:
        - Analyzing error messages and stack traces
        - Identifying potential root causes
        - Providing step-by-step debugging strategies
        - Suggesting fixes with code examples
        - Explaining why the issue occurred
        
        Be practical and provide actionable solutions.`
        break

      case "code-explanation":
        systemPrompt = `You are a programming mentor. Explain code concepts clearly by:
        - Breaking down complex code into understandable parts
        - Explaining the logic and flow
        - Highlighting key programming concepts
        - Providing context about why certain approaches are used
        - Using analogies when helpful
        
        Make explanations accessible but technically accurate.`
        break

      case "architecture":
        systemPrompt = `You are a software architect and system design expert. Provide guidance on:
        - System architecture and design patterns
        - Technology stack recommendations
        - Scalability and performance considerations
        - Best practices for large-scale applications
        - Trade-offs between different approaches
        
        Focus on practical, real-world solutions.`
        break

      case "learning":
        systemPrompt = `You are a programming educator and mentor. Help developers learn by:
        - Explaining concepts from basics to advanced
        - Providing learning roadmaps and resources
        - Suggesting practical projects and exercises
        - Answering questions about programming languages and frameworks
        - Giving career advice for developers
        
        Be encouraging and provide structured learning paths.`
        break

      default:
        systemPrompt = `You are ComConnect-AI, an intelligent programming companion designed specifically for developers. You excel at:
        
        🔧 **Code Assistance**: Writing, reviewing, debugging, and optimizing code
        💡 **Problem Solving**: Breaking down complex programming challenges
        🏗️ **Architecture Guidance**: System design and best practices
        📚 **Learning Support**: Explaining concepts and providing resources
        🚀 **Career Growth**: Technical interview prep and skill development
        
        Always provide:
        - Clear, actionable responses
        - Code examples when relevant
        - Best practices and industry standards
        - Multiple approaches when applicable
        - Resources for further learning
        
        Be concise but comprehensive, and tailor your response to the developer's level of expertise.`
    }

    const fullPrompt = `${systemPrompt}

Developer Question/Request:
${message}

Please provide a helpful, detailed response:`

    // Generate the response
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const aiResponse = response.text()

    return NextResponse.json({
      response: aiResponse.trim(),
      conversationType: conversationType || "general",
      timestamp: new Date().toISOString(),
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
        error: "Failed to generate response. Please try again.",
      },
      { status: 500 },
    )
  }
}
