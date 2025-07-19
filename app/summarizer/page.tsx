"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Sparkles, Copy, Check, Brain, Zap } from "lucide-react"
import Link from "next/link"

export default function SummarizerPage() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Error:", error)
      setSummary("Sorry, there was an error generating the summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">AI Text Summarizer</h1>
              <p className="text-slate-600 font-light mt-2">
                Transform lengthy content into clear, actionable insights
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-semibold text-slate-900">
                <FileText className="h-5 w-5 mr-3 text-indigo-600" />
                Input Text
              </CardTitle>
              <CardDescription className="text-slate-600 font-light">
                Paste or type the content you want to summarize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Paste your text here... (articles, research papers, documents, etc.)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[350px] resize-none border-slate-200 focus:border-indigo-300 rounded-xl"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium">{inputText.length} characters</span>
                <Button
                  onClick={handleSummarize}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-8 py-3 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-3" />
                      Summarize
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-between text-xl font-semibold text-slate-900">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-3 text-purple-600" />
                  AI Summary
                </div>
                {summary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="rounded-xl border-slate-200 hover:border-purple-300 bg-transparent"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </CardTitle>
              <CardDescription className="text-slate-600 font-light">
                Your AI-generated summary will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[350px]">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-medium text-lg">Analyzing your content...</p>
                      <p className="text-slate-500 text-sm mt-2">This may take a few moments</p>
                    </div>
                  </div>
                </div>
              ) : summary ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 min-h-[350px] border border-indigo-100">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-slate-800 leading-relaxed whitespace-pre-wrap font-light">{summary}</div>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="text-2xl font-bold text-indigo-600">{inputText.length}</div>
                      <div className="text-xs text-slate-500 font-medium tracking-wide">ORIGINAL</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="text-2xl font-bold text-purple-600">{summary.length}</div>
                      <div className="text-xs text-slate-500 font-medium tracking-wide">SUMMARY</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="text-2xl font-bold text-emerald-600">
                        {Math.round((1 - summary.length / inputText.length) * 100)}%
                      </div>
                      <div className="text-xs text-slate-500 font-medium tracking-wide">REDUCED</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-slate-500">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Your summary will appear here</p>
                      <p className="text-sm text-slate-400 mt-1">Start by adding some text to summarize</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Elegant Tips Section */}
        <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
              💡 Tips for Better Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-indigo-600 text-base">📝 Content Quality</h4>
                <p className="text-slate-600 font-light leading-relaxed">
                  Use well-structured text with clear paragraphs and proper formatting for optimal results.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600 text-base">📏 Optimal Length</h4>
                <p className="text-slate-600 font-light leading-relaxed">
                  Works best with texts between 500-5000 words for comprehensive analysis.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 text-base">🎯 Content Types</h4>
                <p className="text-slate-600 font-light leading-relaxed">
                  Perfect for articles, research papers, reports, and technical documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
