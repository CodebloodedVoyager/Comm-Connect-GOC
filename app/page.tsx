import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  CheckCircle,
  Play,
  Zap,
  Target,
  Globe,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                ComConnect-AI
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">INTELLIGENT LEARNING</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/companion"
              className="text-slate-600 hover:text-indigo-600 transition-all duration-300 font-medium text-sm tracking-wide"
            >
              AI COMPANION
            </Link>
            <Link
              href="/roadmap"
              className="text-slate-600 hover:text-indigo-600 transition-all duration-300 font-medium text-sm tracking-wide"
            >
              ROADMAP
            </Link>
            <Link
              href="/events"
              className="text-slate-600 hover:text-indigo-600 transition-all duration-300 font-medium text-sm tracking-wide"
            >
              EVENTS
            </Link>
            <Link href="/companion">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 relative">
        {/* Elegant Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-10">
            {/* Elegant Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-indigo-100 shadow-lg">
              <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-sm font-semibold text-indigo-700 tracking-wide">AI-POWERED PLATFORM</span>
              <div className="ml-3 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full font-bold tracking-wide">
                BETA
              </div>
            </div>

            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                Connect & Learn{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                  Intelligently
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl font-light">
                Your intelligent programming companion for code assistance, personalized roadmaps, and curated tech
                events.
              </p>
            </div>

            {/* Elegant Stats */}
            <div className="flex items-center space-x-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">15K+</div>
                <div className="text-sm text-slate-500 font-medium tracking-wide">DEVELOPERS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-slate-500 font-medium tracking-wide">QUESTIONS SOLVED</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">2K+</div>
                <div className="text-sm text-slate-500 font-medium tracking-wide">EVENTS</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/companion">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Start Coding
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-200 hover:border-indigo-300 px-10 py-4 rounded-xl text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
              >
                <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Elegant Hero Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium tracking-wide">COMCONNECT-AI</div>
                </div>

                {/* Elegant AI Interface */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full"></div>
                      <div className="h-2 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div className="space-y-3 ml-14">
                    <div className="h-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-full"></div>
                    <div className="h-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full w-4/5"></div>
                    <div className="h-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-5/6"></div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm text-slate-700 font-medium">Code Analysis Complete</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-2 bg-indigo-200 rounded-full w-full"></div>
                      <div className="h-2 bg-purple-200 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl opacity-20 transform rotate-12 animate-float"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl opacity-20 transform -rotate-12 animate-float animation-delay-1000"></div>
            <div className="absolute top-1/2 -right-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-30 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Elegant Features Section */}
      <section className="container mx-auto px-6 py-24 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-indigo-100 shadow-lg mb-8">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm font-semibold text-indigo-700 tracking-wide">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Intelligent Tools for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Modern Developers
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the future of development with our sophisticated AI-powered platform designed for modern
            programmers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature 1 - Enhanced */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-3 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">AI Companion</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-light">
                Your intelligent programming assistant for code review, debugging, architecture guidance, and learning
                support.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Code review & debugging</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Architecture guidance</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Learning assistance</span>
                </div>
              </div>
              <Link href="/companion">
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-all duration-300 bg-transparent rounded-xl py-3 font-medium"
                >
                  Try AI Companion
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature 2 - Enhanced */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-3 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">AI Roadmap Generator</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-light">
                Receive personalized learning paths tailored to your goals and current expertise. Navigate your journey
                with confidence.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Personalized learning paths</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Progress tracking</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Resource recommendations</span>
                </div>
              </div>
              <Link href="/roadmap">
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 transition-all duration-300 bg-transparent rounded-xl py-3 font-medium"
                >
                  Generate Roadmap
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature 3 - Enhanced */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-3 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Tech Events Finder</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-light">
                Discover curated tech events, conferences, and networking opportunities to expand your professional
                network.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Location-based discovery</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Event notifications</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-3" />
                  <span className="font-medium">Networking opportunities</span>
                </div>
              </div>
              <Link href="/events">
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300 bg-transparent rounded-xl py-3 font-medium"
                >
                  Find Events
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Social Proof Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 border border-white/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Trusted by Developers Worldwide</h2>
            <p className="text-slate-600 font-light text-lg">
              Join thousands who are transforming their development experience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-indigo-600">25K+</div>
              <div className="text-slate-600 font-medium tracking-wide">ACTIVE DEVELOPERS</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-purple-600">100K+</div>
              <div className="text-slate-600 font-medium tracking-wide">QUESTIONS ANSWERED</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-slate-600 font-medium tracking-wide">LEARNING PATHS</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-emerald-600">99%</div>
              <div className="text-slate-600 font-medium tracking-wide">SATISFACTION RATE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-16 text-center text-white shadow-2xl">
          {/* Elegant Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-32"></div>
          </div>

          <div className="relative z-10 space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight">Ready to Code Smarter?</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto font-light leading-relaxed">
                Join the community of forward-thinking developers who are leveraging AI to write better code, learn
                faster, and build amazing things
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/companion">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-slate-50 px-12 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Start Coding Now
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                <Users className="mr-3 h-5 w-5" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="container mx-auto px-6 py-16 border-t border-slate-200">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
              ComConnect-AI
            </span>
          </div>
          <p className="text-slate-600 font-light">Connecting developers through intelligent programming experiences</p>
          <div className="flex justify-center space-x-8 text-sm text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors font-medium">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
