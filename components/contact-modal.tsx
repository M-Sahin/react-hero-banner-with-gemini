"use client"

import { useState } from "react"
import { CloseIcon, SparkleIcon, SpinnerIcon } from "./icons"

interface User {
  name: string
  occupation: string
  employer: string
  location: string
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

interface ContactModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

async function fetchWithRetry(apiUrl: string, payload: object, retries = 3, delay = 1000): Promise<GeminiResponse> {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(apiUrl, payload, retries - 1, delay * 2)
    } else {
      throw error
    }
  }
}

export function ContactModal({ user, isOpen, onClose }: ContactModalProps) {
  const [visitorName, setVisitorName] = useState("")
  const [visitorEmail, setVisitorEmail] = useState("")
  const [contactReason, setContactReason] = useState("Job Opportunity")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateMessage = async () => {
    if (!visitorName || !contactReason) {
      setError("Please fill in your name and select a reason first.")
      return
    }

    setIsLoading(true)
    setError(null)

    const apiKey = ""
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`

    const systemPrompt = `You are a professional assistant. A visitor wants to contact ${user.name} (${user.occupation}).
The visitor's name is ${visitorName}.
Their reason for contacting is: "${contactReason}".
Write a polite, professional, and concise message draft (1-3 sentences) for the visitor to send.
Do not include a subject line. Start the message directly, e.g., "Hello ${user.name.split(" ")[0]},".`

    const userQuery = "Please generate the message draft now."

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    }

    try {
      const result = await fetchWithRetry(apiUrl, payload)
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text

      if (text) {
        setMessage(text)
      } else {
        throw new Error("No content received from API.")
      }
    } catch {
      setError("Failed to generate message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8 bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
              Reason for Contacting
            </label>
            <select
              id="reason"
              value={contactReason}
              onChange={(e) => setContactReason(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Job Opportunity</option>
              <option>Project Collaboration</option>
              <option>Networking</option>
              <option>General Inquiry</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={handleGenerateMessage}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg transition-all duration-300 ease-in-out
                         flex items-center justify-center gap-2
                         hover:bg-indigo-500 
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75
                         disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
              {isLoading ? <SpinnerIcon /> : <SparkleIcon />}
              {isLoading ? "Generating..." : "Generate Message Draft"}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-lg bg-gray-600 text-white font-semibold transition-all duration-300 ease-in-out
                         hover:bg-gray-500
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
