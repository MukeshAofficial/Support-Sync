"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageSquare, Mic, Globe, Zap, TrendingUp, CheckCircle, Send } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface Profile {
  first_name: string | null
  last_name: string | null
}

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState("upload")
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from("profiles").select("first_name, last_name").eq("id", user.id).single()
        setProfile(data)
      }
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser())
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SupportSync</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-purple-600 transition-colors">
              Admin
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar>
                      {user && user.user_metadata?.avatar_url ? (
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name || user.user_metadata.full_name || "User"} />
                      ) : null}
                      <AvatarFallback>
                        {user && (user.user_metadata?.name?.[0] || user.user_metadata?.full_name?.[0] || profile?.first_name?.[0] || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-800">
                      {user && (user.user_metadata?.name || user.user_metadata?.full_name || (profile ? `${profile.first_name} ${profile.last_name}` : null) || "User")}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user && (user.user_metadata?.name || user.user_metadata?.full_name || (profile ? `${profile.first_name} ${profile.last_name}` : null) || "User")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push("/login")}>Sign In</Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
            🚀 Now with AI-Powered Multilingual Support
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Customer Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Automate and enhance customer support with multilingual AI, workflow orchestration, and omnichannel
            communication. Handle 10x more queries with 90% less effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-purple-200 hover:bg-purple-50">
              Watch Demo
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-purple-100 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Queries Handled Daily</div>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">50+</div>
                <div className="text-sm text-gray-600">Languages Supported</div>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime Guarantee</div>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">2.5s</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Modern Support</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your customer support operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Multilingual AI Support</CardTitle>
                <CardDescription>
                  Powered by Sarvam.ai, communicate with customers in 50+ languages with natural, context-aware
                  responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/chatbot">
                  <Button variant="outline" className="w-full">
                    Try Chatbot
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Voice Bot Integration</CardTitle>
                <CardDescription>
                  Real-time voice support with natural speech recognition and response generation for seamless
                  conversations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/voice-bot">
                  <Button variant="outline" className="w-full">
                    Try Voice Bot
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Workflow Orchestration</CardTitle>
                <CardDescription>
                  Bhindi AI-powered automation that routes, prioritizes, and resolves tickets intelligently across all
                  channels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/integrations">
                  <Button variant="outline" className="w-full">
                    Setup Integrations
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Knowledge Base Section with Animations */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-indigo-50 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SupportSync Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI-powered platform transforms customer support across all channels
            </p>
          </div>

          {/* Animated Workflow Demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Smart Knowledge Base Management</h3>
              <p className="text-lg text-gray-600 mb-8">
                Upload your FAQs, documentation, and support materials. Our AI automatically processes and indexes
                content for instant, accurate responses using RAG technology.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Drag & drop file uploads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Automatic content indexing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Real-time content updates</span>
                </div>
              </div>
              <Link href="/knowledge-base">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Upload Knowledge Base
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Animated Visual Demo */}
            <div className="relative">
              {/* Main Demo Container */}
              <div className="bg-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Floating Elements Animation */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-8 right-8">
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
                <div className="absolute top-6 right-12">
                  <div
                    className="w-1 h-1 bg-purple-300 rounded-full animate-ping"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>

                {/* File Upload Animation */}
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 mb-6 relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      {/* Upload animation rings */}
                      <div className="absolute inset-0 border-2 border-purple-300 rounded-full animate-ping"></div>
                      <div
                        className="absolute inset-2 border-2 border-purple-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Processing</h4>
                    <p className="text-gray-600 text-sm">AI analyzing and indexing content...</p>

                    {/* Progress Animation */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full animate-pulse"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Multi-Channel Demo */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Phone Call Demo */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 relative">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {/* Call animation rings */}
                        <div className="absolute inset-0 border-2 border-green-300 rounded-full animate-ping"></div>
                      </div>
                      <p className="text-xs font-medium text-green-800">Voice Call</p>
                      <p className="text-xs text-green-600">Real-time AI</p>
                    </div>
                    {/* Sound waves animation */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <div
                        className="w-1 bg-green-400 rounded-full animate-pulse"
                        style={{ height: "8px", animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-1 bg-green-400 rounded-full animate-pulse"
                        style={{ height: "12px", animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 bg-green-400 rounded-full animate-pulse"
                        style={{ height: "6px", animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 bg-green-400 rounded-full animate-pulse"
                        style={{ height: "10px", animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Chat Widget Demo */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-blue-800">Web Chat</p>
                    <p className="text-xs text-blue-600">Embed Widget</p>

                    {/* Chat bubbles animation */}
                    <div className="absolute bottom-2 right-2 space-y-1">
                      <div
                        className="w-4 h-2 bg-blue-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-3 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Email Demo */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center relative">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-purple-800">Email</p>
                    <p className="text-xs text-purple-600">Auto-Reply</p>

                    {/* Email send animation */}
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Integration Icons */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-float">
                <span className="text-lg">🎫</span>
              </div>
              <div
                className="absolute -top-2 -right-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-sm">☁️</span>
              </div>
              <div
                className="absolute -bottom-4 -left-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center animate-float"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-xs">💬</span>
              </div>
            </div>
          </div>

          {/* Interactive Workflow Demonstrations */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">See SupportSync in Action</h3>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "upload", label: "Upload Knowledge Base", icon: "📄" },
                { id: "chatbot", label: "Chatbot in Action", icon: "💬" },
                { id: "voicebot", label: "Voice Bot Interaction", icon: "🎤" },
                { id: "integrations", label: "App Integrations", icon: "🔗" },
                { id: "phonecall", label: "Phone Call Workflow", icon: "📞" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemo(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Animation Container */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[400px] relative overflow-hidden">
              {/* Upload Knowledge Base Animation */}
              {activeDemo === "upload" && (
                <div className="text-center animate-fade-in">
                  <h4 className="text-xl font-semibold text-gray-900 mb-8">Upload Knowledge Base</h4>
                  <div className="max-w-md mx-auto">
                    {/* Simple File Upload */}
                    <div className="relative mb-8">
                      <div className="w-32 h-40 bg-white rounded-lg shadow-lg mx-auto relative overflow-hidden">
                        <div className="absolute top-4 left-4 right-4">
                          <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="absolute top-2 right-2 text-red-500 text-lg">📄</div>
                        <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-600">FAQ.pdf</div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center relative">
                          <span className="text-white text-xl">🤖</span>
                          <div className="absolute inset-0 border-4 border-purple-300 rounded-full animate-ping"></div>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">AI Analyzing Document</p>
                          <p className="text-sm text-gray-600">Processing content...</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full animate-pulse"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="font-semibold text-green-800">Chatbot Ready!</span>
                      </div>
                      <p className="text-sm text-green-700 text-center">
                        Your knowledge base has been processed and your AI chatbot is ready to answer questions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chatbot in Action Animation */}
              {activeDemo === "chatbot" && (
                <div className="animate-fade-in">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">Chatbot in Action</h4>
                  <div className="flex justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm w-full relative">
                      {/* Chat Header */}
                      <div className="flex items-center space-x-2 mb-4 pb-3 border-b">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">🤖</span>
                        </div>
                        <div>
                          <p className="font-medium">SupportSync AI</p>
                          <div className="text-xs text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse inline-block"></span>
                            Online • Responds in 2.5s
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="space-y-3 mb-4 h-48 overflow-y-auto">
                        <div className="bg-gray-100 rounded-lg p-3 text-sm animate-slide-in-left">
                          👋 Hi! I'm your AI assistant. How can I help you today?
                        </div>

                        <div
                          className="bg-purple-500 text-white rounded-lg p-3 text-sm ml-8 animate-slide-in-right"
                          style={{ animationDelay: "1s" }}
                        >
                          What's your return policy?
                        </div>

                        {/* Typing Indicator */}
                        <div
                          className="bg-gray-100 rounded-lg p-3 text-sm animate-slide-in-left"
                          style={{ animationDelay: "2s" }}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>

                        <div
                          className="bg-gray-100 rounded-lg p-3 text-sm animate-slide-in-left"
                          style={{ animationDelay: "3s" }}
                        >
                          📋 Our return policy allows returns within 30 days of purchase. Items must be in original
                          condition. Would you like me to help you start a return?
                        </div>

                        <div
                          className="bg-purple-500 text-white rounded-lg p-3 text-sm ml-8 animate-slide-in-right"
                          style={{ animationDelay: "4s" }}
                        >
                          Yes, please!
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="flex items-center space-x-2 pt-3 border-t">
                        <input
                          className="flex-1 text-sm border rounded-lg px-3 py-2"
                          placeholder="Type your message..."
                        />
                        <button className="bg-purple-500 text-white rounded-lg p-2">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Floating Success Indicator */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Bot Interaction Animation */}
              {activeDemo === "voicebot" && (
                <div className="text-center animate-fade-in">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6">Voice Bot Interaction</h4>
                  <div className="max-w-md mx-auto">
                    {/* Phone Interface */}
                    <div className="bg-black rounded-3xl p-6 mx-auto w-64 relative">
                      <div className="bg-gray-900 rounded-2xl p-4">
                        {/* Call Status */}
                        <div className="text-center mb-6">
                          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                            <span className="text-white text-2xl">📞</span>
                            <div className="absolute inset-0 border-4 border-green-300 rounded-full animate-ping"></div>
                          </div>
                          <p className="text-white font-medium">SupportSync AI</p>
                          <p className="text-green-400 text-sm">Connected • 00:45</p>
                        </div>

                        {/* Voice Visualization */}
                        <div className="flex justify-center space-x-1 mb-6">
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-green-400 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 20 + 10}px`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            ></div>
                          ))}
                        </div>

                        {/* Conversation Transcript */}
                        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-xs">
                          <div className="text-blue-300 mb-2">🎤 Customer: "I need help with my billing"</div>
                          <div className="text-green-300">
                            🤖 AI: "I understand you need billing assistance. Let me access your account..."
                          </div>
                        </div>

                        {/* Language Indicator */}
                        <div className="flex items-center justify-center space-x-2 text-white text-xs">
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                          <span>Auto-detected: English</span>
                          <span>🌍</span>
                        </div>
                      </div>
                    </div>

                    {/* Call Features */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white rounded-lg p-3 shadow">
                        <div className="text-2xl mb-1">⚡</div>
                        <p className="text-xs font-medium">Instant Response</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow">
                        <div className="text-2xl mb-1">🌐</div>
                        <p className="text-xs font-medium">50+ Languages</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow">
                        <div className="text-2xl mb-1">🧠</div>
                        <p className="text-xs font-medium">Context Aware</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* App Integrations Animation */}
              {activeDemo === "integrations" && (
                <div className="text-center animate-fade-in">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6">App Integrations</h4>
                  <div className="max-w-2xl mx-auto">
                    {/* Clean Grid Layout with light background to match theme */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          {
                            name: "Zendesk",
                            bg: "bg-green-500",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.5 2L2 7.5v9L12.5 22 23 16.5v-9L12.5 2zm0 2.2l8.3 4.3v7L12.5 19.8 4.2 15.5v-7l8.3-4.3z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Salesforce",
                            bg: "bg-blue-500",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            ),
                          },
                          {
                            name: "HubSpot",
                            bg: "bg-orange-500",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Slack",
                            bg: "bg-purple-500",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Gmail",
                            bg: "bg-red-500",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Google Sheets",
                            bg: "bg-green-600",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.44 3H4.56C3.15 3 2 4.15 2 5.56v12.88C2 19.85 3.15 21 4.56 21h14.88c1.41 0 2.56-1.15 2.56-2.56V5.56C22 4.15 20.85 3 19.44 3zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm2 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Microsoft Teams",
                            bg: "bg-blue-600",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.625 5.55c-1.875-1.875-4.95-1.875-6.825 0l-1.8 1.8-1.8-1.8c-1.875-1.875-4.95-1.875-6.825 0-1.875 1.875-1.875 4.95 0 6.825L12 19.95l8.625-7.575c1.875-1.875 1.875-4.95 0-6.825z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Twilio",
                            bg: "bg-red-600",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                              </svg>
                            ),
                          },
                          {
                            name: "GitHub",
                            bg: "bg-gray-800",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Jira",
                            bg: "bg-blue-700",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129V8.915A5.214 5.214 0 0 0 18.294 4.7V5.757zm5.701-5.756H11.443a5.215 5.215 0 0 0 5.215 5.215h2.129V3.158A5.215 5.215 0 0 0 23.995 8.373V1.001z" />
                              </svg>
                            ),
                          },
                          {
                            name: "Discord",
                            bg: "bg-indigo-600",
                            icon: (
                              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                              </svg>
                            ),
                          },
                        ].map((app, index) => (
                          <div
                            key={index}
                            className={`${app.bg} rounded-xl w-16 h-16 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer relative group`}
                            title={app.name}
                          >
                            {app.icon}
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {app.name}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Connection Status */}
                      <div className="mt-6 text-center">
                        <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>All integrations connected</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-white rounded-lg p-4 shadow border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">✅ 12 apps connected successfully</p>
                      <p className="text-xs text-gray-500">Data syncing in real-time across all platforms</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Call Workflow Animation */}
              {activeDemo === "phonecall" && (
                <div className="animate-fade-in">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">Phone Call Workflow</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1: Incoming Call */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <span className="text-white text-2xl">📱</span>
                        <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-ping"></div>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">Incoming Call</h5>
                      <p className="text-sm text-gray-600">Customer calls support line</p>
                      <div className="mt-3 bg-blue-50 rounded-lg p-2">
                        <p className="text-xs text-blue-800">"नमस्ते, मुझे सहायता चाहिए"</p>
                        <p className="text-xs text-blue-600">Hindi detected</p>
                      </div>
                    </div>

                    {/* Step 2: AI Processing */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <span className="text-white text-2xl">🧠</span>
                        <div className="absolute inset-2 border-2 border-purple-300 rounded-full animate-spin"></div>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">AI Processing</h5>
                      <p className="text-sm text-gray-600">Language detection & knowledge retrieval</p>
                      <div className="mt-3 bg-purple-50 rounded-lg p-2">
                        <div className="flex items-center justify-center space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <p className="text-xs text-purple-600 mt-1">Processing in Hindi...</p>
                      </div>
                    </div>

                    {/* Step 3: AI Response */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <span className="text-white text-2xl">🎤</span>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                          <span className="text-xs">💬</span>
                        </div>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">AI Response</h5>
                      <p className="text-sm text-gray-600">Natural voice response in Hindi</p>
                      <div className="mt-3 bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-green-800">"नमस्ते! मैं आपकी सहायता कर सकता हूं..."</p>
                        <p className="text-xs text-green-600">Fluent Hindi response</p>
                      </div>
                    </div>
                  </div>

                  {/* Call Statistics */}
                  <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">2.1s</div>
                        <div className="text-xs text-gray-600">Response Time</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-indigo-600">98%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">47</div>
                        <div className="text-xs text-gray-600">Languages</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">24/7</div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Customer Support?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of companies already using SupportSync to deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-purple-100 hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SupportSync</span>
              </div>
              <p className="text-gray-400">
                Transforming customer support with AI-powered automation and multilingual capabilities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/chatbot" className="hover:text-white transition-colors">
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link href="/voice-bot" className="hover:text-white transition-colors">
                    Voice Bot
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge-base" className="hover:text-white transition-colors">
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SupportSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
