"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Code,
  Smartphone,
  Globe,
  Database,
  Cpu,
  Palette,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Flame,
  Calendar,
  Trophy,
  Target,
} from "lucide-react"
import Link from "next/link"

const techOptions = [
  { value: "web-dev", label: "Web Development", icon: Globe },
  { value: "mobile-dev", label: "Mobile Development", icon: Smartphone },
  { value: "ai-ml", label: "AI/Machine Learning", icon: Brain },
  { value: "data-science", label: "Data Science", icon: Database },
  { value: "devops", label: "DevOps", icon: Cpu },
  { value: "ui-ux", label: "UI/UX Design", icon: Palette },
  { value: "blockchain", label: "Blockchain/Web3", icon: Code },
]

interface RoadmapStep {
  level: string
  title: string
  description: string
  skills: string[]
  topics: {
    name: string
    subtopics: string[]
    resources: string[]
    estimatedHours: number
  }[]
  duration: string
}

interface ProgressData {
  completedSkills: Set<string>
  completedSubtopics: Set<string>
  completedResources: Set<string>
  dailyStreak: number
  lastActiveDate: string
  totalStudyHours: number
}

export default function RoadmapPage() {
  const [selectedTech, setSelectedTech] = useState("")
  const [currentKnowledge, setCurrentKnowledge] = useState("")
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Toggle states for collapsible sections
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set())
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set())

  // Progress tracking
  const [progress, setProgress] = useState<ProgressData>({
    completedSkills: new Set(),
    completedSubtopics: new Set(),
    completedResources: new Set(),
    dailyStreak: 0,
    lastActiveDate: "",
    totalStudyHours: 0,
  })

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`roadmap-progress-${selectedTech}`)
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setProgress({
        completedSkills: new Set(parsed.completedSkills || []),
        completedSubtopics: new Set(parsed.completedSubtopics || []),
        completedResources: new Set(parsed.completedResources || []),
        dailyStreak: parsed.dailyStreak || 0,
        lastActiveDate: parsed.lastActiveDate || "",
        totalStudyHours: parsed.totalStudyHours || 0,
      })
    }
  }, [selectedTech])

  // Save progress to localStorage
  const saveProgress = (newProgress: ProgressData) => {
    const toSave = {
      ...newProgress,
      completedSkills: Array.from(newProgress.completedSkills),
      completedSubtopics: Array.from(newProgress.completedSubtopics),
      completedResources: Array.from(newProgress.completedResources),
    }
    localStorage.setItem(`roadmap-progress-${selectedTech}`, JSON.stringify(toSave))
    setProgress(newProgress)
  }

  // Update daily streak
  const updateStreak = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = progress.dailyStreak

    if (progress.lastActiveDate === today) {
      // Already active today, no change
      return
    } else if (progress.lastActiveDate === yesterday) {
      // Consecutive day
      newStreak += 1
    } else if (progress.lastActiveDate !== today) {
      // Streak broken or first time
      newStreak = 1
    }

    saveProgress({
      ...progress,
      dailyStreak: newStreak,
      lastActiveDate: today,
    })
  }

  // Toggle functions
  const toggleSkills = (stepIndex: number) => {
    const newExpanded = new Set(expandedSkills)
    if (newExpanded.has(stepIndex)) {
      newExpanded.delete(stepIndex)
    } else {
      newExpanded.add(stepIndex)
    }
    setExpandedSkills(newExpanded)
  }

  const toggleTopics = (topicKey: string) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey)
    } else {
      newExpanded.add(topicKey)
    }
    setExpandedTopics(newExpanded)
  }

  const toggleSubtopics = (topicKey: string) => {
    const newExpanded = new Set(expandedSubtopics)
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey)
    } else {
      newExpanded.add(topicKey)
    }
    setExpandedSubtopics(newExpanded)
  }

  const toggleResources = (topicKey: string) => {
    const newExpanded = new Set(expandedResources)
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey)
    } else {
      newExpanded.add(topicKey)
    }
    setExpandedResources(newExpanded)
  }

  // Progress tracking functions
  const toggleSkillCompletion = (skill: string) => {
    updateStreak()
    const newCompleted = new Set(progress.completedSkills)
    if (newCompleted.has(skill)) {
      newCompleted.delete(skill)
    } else {
      newCompleted.add(skill)
    }
    saveProgress({ ...progress, completedSkills: newCompleted })
  }

  const toggleSubtopicCompletion = (subtopic: string, estimatedHours: number) => {
    updateStreak()
    const newCompleted = new Set(progress.completedSubtopics)
    let newStudyHours = progress.totalStudyHours

    if (newCompleted.has(subtopic)) {
      newCompleted.delete(subtopic)
      newStudyHours = Math.max(0, newStudyHours - estimatedHours)
    } else {
      newCompleted.add(subtopic)
      newStudyHours += estimatedHours
    }

    saveProgress({
      ...progress,
      completedSubtopics: newCompleted,
      totalStudyHours: newStudyHours,
    })
  }

  const toggleResourceCompletion = (resource: string) => {
    updateStreak()
    const newCompleted = new Set(progress.completedResources)
    if (newCompleted.has(resource)) {
      newCompleted.delete(resource)
    } else {
      newCompleted.add(resource)
    }
    saveProgress({ ...progress, completedResources: newCompleted })
  }

  const handleGenerateRoadmap = async () => {
    if (!selectedTech || !currentKnowledge.trim()) return

    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technology: selectedTech,
          currentKnowledge: currentKnowledge,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate roadmap")
      }

      setRoadmap(data.roadmap)

      // Show a message if using fallback
      if (data.fallback && data.message) {
        setError(`ℹ️ ${data.message}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Failed to generate roadmap. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTechOption = techOptions.find((option) => option.value === selectedTech)

  // Calculate progress statistics
  const totalSkills = roadmap.reduce((total, step) => total + step.skills.length, 0)
  const totalSubtopics = roadmap.reduce(
    (total, step) => total + (step.topics?.reduce((topicTotal, topic) => topicTotal + topic.subtopics.length, 0) || 0),
    0,
  )
  const totalResources = roadmap.reduce(
    (total, step) => total + (step.topics?.reduce((topicTotal, topic) => topicTotal + topic.resources.length, 0) || 0),
    0,
  )

  const skillsProgress = totalSkills > 0 ? (progress.completedSkills.size / totalSkills) * 100 : 0
  const subtopicsProgress = totalSubtopics > 0 ? (progress.completedSubtopics.size / totalSubtopics) * 100 : 0
  const resourcesProgress = totalResources > 0 ? (progress.completedResources.size / totalResources) * 100 : 0
  const overallProgress = (skillsProgress + subtopicsProgress + resourcesProgress) / 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Roadmap Generator</h1>
              <p className="text-gray-600">Get personalized learning paths for your tech journey</p>
            </div>
          </div>
          <Brain className="h-8 w-8 text-green-600" />
        </div>

        {/* Progress Dashboard */}
        {roadmap.length > 0 && (
          <Card className="mb-8 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Your Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Daily Streak</span>
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{progress.dailyStreak}</div>
                  <div className="text-xs text-gray-500">days in a row</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Study Hours</span>
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{progress.totalStudyHours}</div>
                  <div className="text-xs text-gray-500">hours completed</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Skills Mastered</span>
                    <Target className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {progress.completedSkills.size}/{totalSkills}
                  </div>
                  <div className="text-xs text-gray-500">skills completed</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{Math.round(overallProgress)}%</div>
                  <div className="text-xs text-gray-500">total completion</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Skills Progress</span>
                    <span>{Math.round(skillsProgress)}%</span>
                  </div>
                  <Progress value={skillsProgress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Topics Progress</span>
                    <span>{Math.round(subtopicsProgress)}%</span>
                  </div>
                  <Progress value={subtopicsProgress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resources Progress</span>
                    <span>{Math.round(resourcesProgress)}%</span>
                  </div>
                  <Progress value={resourcesProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Tell us about your learning goals</CardTitle>
            <CardDescription>
              We'll create a personalized roadmap based on your interests and current knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">What technology do you want to learn?</label>
                <Select value={selectedTech} onValueChange={setSelectedTech}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {techOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">What do you already know?</label>
                <Input
                  placeholder="e.g., HTML, CSS, basic JavaScript..."
                  value={currentKnowledge}
                  onChange={(e) => setCurrentKnowledge(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateRoadmap}
              disabled={!selectedTech || !currentKnowledge.trim() || isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate My Learning Roadmap
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              error.startsWith("ℹ️") ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <p className={`text-sm ${error.startsWith("ℹ️") ? "text-blue-800" : "text-red-800"}`}>{error}</p>
          </div>
        )}

        {/* Roadmap Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-xl text-gray-600">Creating your personalized roadmap...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </div>
        ) : roadmap.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your {selectedTechOption?.label} Learning Roadmap
              </h2>
              <p className="text-gray-600">A comprehensive path based on your current knowledge and goals</p>
            </div>

            {/* Enhanced Legend Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">Skills to Learn</h4>
                      <p className="text-gray-600">Practical abilities you'll develop</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-1">Topics & Subtopics</h4>
                      <p className="text-gray-600">Detailed concepts to study</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mt-0.5 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-1">Learning Resources</h4>
                      <p className="text-gray-600">Recommended materials and courses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8">
              {roadmap.map((step, stepIndex) => (
                <Card key={stepIndex} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            step.level === "Beginner"
                              ? "bg-green-500"
                              : step.level === "Intermediate"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                          }`}
                        >
                          {stepIndex + 1}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{step.title}</CardTitle>
                          <div className="flex items-center space-x-3 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                step.level === "Beginner"
                                  ? "bg-green-100 text-green-800"
                                  : step.level === "Intermediate"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {step.level}
                            </span>
                            <span className="text-sm text-gray-500">{step.duration}</span>
                            <span className="text-sm text-gray-500">
                              ~{step.topics?.reduce((total, topic) => total + (topic.estimatedHours || 0), 0) || 0}{" "}
                              hours
                            </span>
                          </div>
                        </div>
                      </div>
                      {stepIndex < roadmap.length - 1 && <ArrowRight className="h-6 w-6 text-gray-400" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600 text-lg">{step.description}</p>

                    {/* Collapsible Skills Section */}
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => toggleSkills(stepIndex)}
                        className="w-full justify-between p-0 h-auto font-semibold text-gray-900 text-lg hover:bg-transparent"
                      >
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                          Key Skills to Master ({step.skills.length})
                        </div>
                        {expandedSkills.has(stepIndex) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>

                      {expandedSkills.has(stepIndex) && (
                        <div className="mt-3 space-y-2">
                          {step.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center space-x-3">
                              <Checkbox
                                checked={progress.completedSkills.has(skill)}
                                onCheckedChange={() => toggleSkillCompletion(skill)}
                              />
                              <span
                                className={`px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200 font-medium flex-1 ${
                                  progress.completedSkills.has(skill) ? "line-through opacity-60" : ""
                                }`}
                              >
                                {skill}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collapsible Topics Section */}
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => toggleTopics(`${stepIndex}-topics`)}
                        className="w-full justify-between p-0 h-auto font-semibold text-gray-900 text-lg hover:bg-transparent"
                      >
                        <div className="flex items-center">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                          Detailed Learning Topics ({step.topics?.length || 0})
                        </div>
                        {expandedTopics.has(`${stepIndex}-topics`) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>

                      {expandedTopics.has(`${stepIndex}-topics`) && (
                        <div className="mt-4 space-y-6">
                          {step.topics?.map((topic, topicIndex) => {
                            const topicKey = `${stepIndex}-${topicIndex}`
                            return (
                              <div key={topicIndex} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="font-semibold text-gray-900 text-lg">{topic.name}</h5>
                                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                                    ~{topic.estimatedHours} hours
                                  </span>
                                </div>

                                {/* Collapsible Subtopics */}
                                <div className="mb-4">
                                  <Button
                                    variant="ghost"
                                    onClick={() => toggleSubtopics(topicKey)}
                                    className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-800 hover:bg-transparent mb-2"
                                  >
                                    <span className="uppercase tracking-wide">
                                      What you'll learn ({topic.subtopics?.length || 0})
                                    </span>
                                    {expandedSubtopics.has(topicKey) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>

                                  {expandedSubtopics.has(topicKey) && (
                                    <div className="space-y-2">
                                      {topic.subtopics?.map((subtopic, subtopicIndex) => (
                                        <div key={subtopicIndex} className="flex items-start space-x-3">
                                          <Checkbox
                                            checked={progress.completedSubtopics.has(subtopic)}
                                            onCheckedChange={() =>
                                              toggleSubtopicCompletion(
                                                subtopic,
                                                Math.ceil(topic.estimatedHours / topic.subtopics.length),
                                              )
                                            }
                                          />
                                          <span
                                            className={`text-gray-700 text-sm flex-1 ${
                                              progress.completedSubtopics.has(subtopic) ? "line-through opacity-60" : ""
                                            }`}
                                          >
                                            {subtopic}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Collapsible Resources */}
                                <div>
                                  <Button
                                    variant="ghost"
                                    onClick={() => toggleResources(topicKey)}
                                    className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-800 hover:bg-transparent mb-2"
                                  >
                                    <span className="uppercase tracking-wide">
                                      Recommended Resources ({topic.resources?.length || 0})
                                    </span>
                                    {expandedResources.has(topicKey) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>

                                  {expandedResources.has(topicKey) && (
                                    <div className="space-y-2">
                                      {topic.resources?.map((resource, resourceIndex) => (
                                        <div key={resourceIndex} className="flex items-center space-x-3">
                                          <Checkbox
                                            checked={progress.completedResources.has(resource)}
                                            onCheckedChange={() => toggleResourceCompletion(resource)}
                                          />
                                          <span
                                            className={`px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200 ${
                                              progress.completedResources.has(resource) ? "line-through opacity-60" : ""
                                            }`}
                                          >
                                            {resource}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          }) || (
                            <div className="text-gray-500 text-sm italic">
                              Detailed topics will be generated based on your selection
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
