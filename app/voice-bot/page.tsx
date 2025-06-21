"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Phone, Globe } from "lucide-react"
import Link from "next/link"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
]

interface VoiceSession {
  id: string
  transcript: string
  response: string
  timestamp: Date
  language: string
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
    speechSynthesis: any
  }
}

export default function VoiceBotPage() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [sessions, setSessions] = useState<VoiceSession[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [audioLevel, setAudioLevel] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = selectedLanguage

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")

        setCurrentTranscript(transcript)

        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceInput(transcript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setIsProcessing(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [selectedLanguage])

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      setCurrentTranscript("")
      recognitionRef.current.lang = selectedLanguage
      recognitionRef.current.start()

      // Simulate audio level animation
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        setAudioLevel(0)
      }, 5000)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setAudioLevel(0)
  }

  const handleVoiceInput = async (transcript: string) => {
    setIsProcessing(true)
    setCurrentTranscript("")

    // Simulate AI processing
    setTimeout(() => {
      const response = generateVoiceResponse(transcript, selectedLanguage)

      const session: VoiceSession = {
        id: Date.now().toString(),
        transcript,
        response,
        timestamp: new Date(),
        language: selectedLanguage,
      }

      setSessions((prev) => [session, ...prev])
      speakResponse(response, selectedLanguage)
      setIsProcessing(false)
    }, 2000)
  }

  const generateVoiceResponse = (input: string, language: string): string => {
    const responses = {
      en: [
        "I understand your request. Let me help you with that right away.",
        "Thank you for your question. Here's what I found in our knowledge base.",
        "I can assist you with that. Let me provide you with the information you need.",
        "That's a great question. Based on our support documentation, here's the answer.",
        "I'm here to help. Let me walk you through the solution step by step.",
      ],
      es: [
        "Entiendo tu solicitud. Permíteme ayudarte de inmediato.",
        "Gracias por tu pregunta. Esto es lo que encontré en nuestra base de conocimientos.",
        "Puedo ayudarte con eso. Permíteme proporcionarte la información que necesitas.",
        "Esa es una gran pregunta. Basado en nuestra documentación de soporte, aquí está la respuesta.",
        "Estoy aquí para ayudar. Permíteme guiarte a través de la solución paso a paso.",
      ],
      hi: [
        "मैं आपका अनुरोध समझ गया हूं। मुझे तुरंत आपकी मदद करने दें।",
        "आपके प्रश्न के लिए धन्यवाद। यह है जो मुझे हमारे ज्ञान आधार में मिला।",
        "मैं इसमें आपकी सहायता कर सकता हूं। मुझे आपको आवश्यक जानकारी प्रदान करने दें।",
        "यह एक बेहतरीन प्रश्न है। हमारे सहायता दस्तावेज़ीकरण के आधार पर, यहां उत्तर है।",
        "मैं मदद के लिए यहां हूं। मुझे आपको समाधान के माध्यम से कदम दर कदम ले जाने दें।",
      ],
    }

    const langResponses = responses[language as keyof typeof responses] || responses.en
    return langResponses[Math.floor(Math.random() * langResponses.length)]
  }

  const speakResponse = (text: string, language: string) => {
    if (synthRef.current) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const selectedLangData = languages.find((lang) => lang.code === selectedLanguage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Voice Bot</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Globe className="w-5 h-5 text-gray-500" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue>
                  {selectedLangData && (
                    <span className="flex items-center space-x-2">
                      <span>{selectedLangData.flag}</span>
                      <span>{selectedLangData.name}</span>
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Voice Interface */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Voice Support Assistant</span>
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Ready
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {/* Voice Visualizer */}
            <div className="mb-8">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div
                  className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                    isListening ? "border-purple-500 animate-pulse" : "border-gray-300"
                  }`}
                >
                  <div
                    className={`absolute inset-4 rounded-full transition-all duration-300 ${
                      isListening ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-100"
                    } flex items-center justify-center`}
                  >
                    {isListening ? (
                      <Mic className="w-16 h-16 text-white" />
                    ) : isSpeaking ? (
                      <Volume2 className="w-16 h-16 text-purple-600" />
                    ) : isProcessing ? (
                      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MicOff className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Audio Level Indicator */}
                {isListening && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-purple-500 rounded-full transition-all duration-100"
                          style={{
                            height: `${Math.max(4, (audioLevel / 100) * 20 + Math.random() * 10)}px`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Transcript */}
              {currentTranscript && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <p className="text-purple-800 italic">"{currentTranscript}"</p>
                </div>
              )}

              {/* Status Messages */}
              <div className="mb-6">
                {isListening && <p className="text-purple-600 font-medium">Listening... Speak now</p>}
                {isProcessing && <p className="text-indigo-600 font-medium">Processing your request...</p>}
                {isSpeaking && <p className="text-green-600 font-medium">Speaking response...</p>}
                {!isListening && !isProcessing && !isSpeaking && (
                  <p className="text-gray-600">Click the microphone to start speaking</p>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!isListening ? (
                <Button
                  onClick={startListening}
                  disabled={isProcessing || isSpeaking}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Speaking
                </Button>
              ) : (
                <Button onClick={stopListening} variant="destructive" size="lg" className="px-8">
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Listening
                </Button>
              )}

              {isSpeaking && (
                <Button onClick={stopSpeaking} variant="outline" size="lg" className="px-8">
                  <VolumeX className="w-5 h-5 mr-2" />
                  Stop Speaking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {languages.find((l) => l.code === session.language)?.flag}{" "}
                        {languages.find((l) => l.code === session.language)?.name}
                      </Badge>
                      <span className="text-xs text-gray-500">{session.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">You said:</p>
                        <p className="text-sm text-gray-900">"{session.transcript}"</p>
                      </div>
                      <div className="bg-purple-50 rounded p-3">
                        <p className="text-sm font-medium text-purple-700 mb-1">Assistant replied:</p>
                        <p className="text-sm text-purple-900">"{session.response}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Voice Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Speak Clearly</h3>
                <p className="text-sm text-gray-600">
                  Click the microphone button and speak your question clearly in your preferred language
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Listen to Response</h3>
                <p className="text-sm text-gray-600">
                  Our AI will process your question and respond with a natural voice in your language
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Multilingual Support</h3>
                <p className="text-sm text-gray-600">
                  Switch between 50+ languages for seamless communication in your native language
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
