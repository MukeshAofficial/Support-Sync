"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useDropzone } from "react-dropzone"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  type: string
}

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, status: 'uploading', progress: 30 } : f));
      const res = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f));
      } else {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, status: 'error', progress: 100 } : f));
      }
    } catch (err) {
      setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, status: 'error', progress: 100 } : f));
    } finally {
      setIsUploading(false);
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
      type: file.type,
    }))
    setFiles((prev) => [...prev, ...newFiles])
    setIsUploading(true)
    newFiles.forEach((file, idx) => {
      uploadFile(acceptedFiles[idx], file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/markdown": [".md"],
    },
  })

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Upload</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-purple-600" />
              <span>Upload Support Documents</span>
            </CardTitle>
            <CardDescription>
              Upload your FAQs, documentation, and support materials. Supported formats: PDF, DOC, DOCX, TXT, MD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              {isDragActive ? (
                <p className="text-lg text-purple-600 font-medium">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 font-medium mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-500">Maximum file size: 10MB per file</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Uploaded Files ({files.length})</span>
                <Badge variant="outline">
                  {files.filter((f) => f.status === "completed").length} / {files.length} Processed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(file.status)}
                          {getStatusIcon(file.status)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{formatFileSize(file.size)}</p>
                      {(file.status === "uploading" || file.status === "processing") && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600">
                  Drag and drop your support documents, FAQs, and knowledge base files
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-sm text-gray-600">
                  Our AI automatically processes and indexes your content for optimal search
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Ready to Use</h3>
                <p className="text-sm text-gray-600">
                  Your chatbot and voice bot can now provide accurate answers from your knowledge base
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
