"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Brain,
  Sparkles,
  Copy,
  Check,
  Code,
  Bug,
  BookOpen,
  Layers,
  GraduationCap,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

const conversationTypes = [
  { value: "general", label: "General Help", icon: MessageSquare, description: "Ask anything programming-related" },
  { value: "code-review", label: "Code Review", icon: Code, description: "Get feedback on your code" },
  { value: "debug-help", label: "Debug Help", icon: Bug, description: "Solve bugs and errors" },
  { value: "code-explanation", label: "Code Explanation", icon: BookOpen, description: "Understand how code works" },
  { value: "architecture", label: "Architecture", icon: Layers, description: "System design guidance" },
  { value: "learning", label: "Learning Path", icon: GraduationCap, description: "Learn new technologies" },
]

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  conversationType?: string
}

export default function CompanionPage() {
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationType, setConversationType] = useState("general")
  const [copied, setCopied] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      conversationType,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/companion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationType,
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't generate a response. Please try again.",
        isUser: false,
        timestamp: new Date(),
        conversationType,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(messageId)
    setTimeout(() => setCopied(null), 2000)
  }

  const clearConversation = () => {
    setMessages([])
  }

  const selectedType = conversationTypes.find((type) => type.value === conversationType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Elegant Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 hover:border-indigo-300 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">AI Companion</h1>
              <p className="text-slate-600 font-light mt-2">
                Your intelligent programming assistant for code, debugging, and learning
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Conversation Type Selector */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-slate-900">Choose Your Conversation Type</CardTitle>
            <CardDescription className="text-slate-600 font-light">
              Select the type of assistance you need for more targeted help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {conversationTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.value}
                    onClick={() => setConversationType(type.value)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      conversationType === type.value
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-25"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          conversationType === type.value ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-light">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Messages */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl font-semibold text-slate-900">
                    {selectedType && <selectedType.icon className="h-5 w-5 mr-3 text-indigo-600" />}
                    {selectedType?.label} Assistant
                  </CardTitle>
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearConversation}
                      className="rounded-xl border-slate-200 hover:border-red-300 bg-transparent text-red-600 hover:text-red-700"
                    >
                      Clear Chat
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-8 w-8 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Help!</h3>
                      <p className="text-slate-600 font-light">
                        Ask me anything about programming, debugging, code review, or learning new technologies.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.isUser
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-light leading-relaxed">{message.content}</div>
                          <div className="flex items-center justify-between mt-3">
                            <span className={`text-xs ${message.isUser ? "text-indigo-100" : "text-slate-500"}`}>
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {!message.isUser && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="h-6 w-6 p-0 hover:bg-slate-200"
                              >
                                {copied === message.id ? (
                                  <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3 text-slate-500" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-4 rounded-2xl max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-1000"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-2000"></div>
                          <span className="text-slate-600 font-light ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Input */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask me anything about programming, debugging, code review, architecture, or learning new technologies..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="min-h-[120px] resize-none border-slate-200 focus:border-indigo-300 rounded-xl"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
                      {inputMessage.length} characters • Press Enter to send, Shift+Enter for new line
                    </span>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-3" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Tips */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 tracking-tight">
                  💡 How to Get Better Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-indigo-600 text-sm mb-1">🔍 Be Specific</h4>
                    <p className="text-slate-600 font-light text-sm">
                      Include error messages, code snippets, and context for better assistance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 text-sm mb-1">📝 Share Code</h4>
                    <p className="text-slate-600 font-light text-sm">
                      Paste your code directly for reviews, debugging, and explanations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 text-sm mb-1">🎯 Choose Type</h4>
                    <p className="text-slate-600 font-light text-sm">
                      Select the right conversation type for more targeted responses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 tracking-tight">
                  🚀 Popular Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 rounded-xl border-slate-200 hover:border-indigo-300 bg-transparent"
                  onClick={() => setInputMessage("How do I optimize this React component for performance?")}
                >
                  <Code className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="text-sm">React Performance Tips</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 rounded-xl border-slate-200 hover:border-indigo-300 bg-transparent"
                  onClick={() => setInputMessage("I'm getting a TypeError in JavaScript. Can you help debug it?")}
                >
                  <Bug className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-sm">Debug JavaScript Error</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 rounded-xl border-slate-200 hover:border-indigo-300 bg-transparent"
                  onClick={() => setInputMessage("What's the best architecture for a scalable web application?")}
                >
                  <Layers className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">System Architecture</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 rounded-xl border-slate-200 hover:border-indigo-300 bg-transparent"
                  onClick={() => setInputMessage("I want to learn machine learning. Where should I start?")}
                >
                  <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Learning Roadmap</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
