"use client"

import { useState } from "react"
import { BriefcaseIcon, MapPinIcon } from "@/components/icons"
import { ContactModal } from "@/components/contact-modal"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = {
    name: "Alex Johnson",
    occupation: "Senior Software Engineer",
    employer: "TechNova Solutions",
    location: "Berlin, Germany",
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 -z-10 h-full w-full 
                   bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]
                   md:bg-gradient-to-br md:from-gray-900 md:via-indigo-950 md:to-purple-950"
      ></div>

      {/* 2-Column Content Wrapper */}
      <div className="relative z-10 flex h-full w-full flex-col md:flex-row">
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center md:justify-end p-8 lg:pr-24">
          <div className="w-full max-w-md text-left">
            {/* User's Name */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{user.name}</h1>

            {/* Info Section */}
            <div className="flex flex-col items-start justify-center gap-4 mt-8">
              {/* Occupation + Employer */}
              <div className="flex items-center gap-3 text-lg text-gray-300">
                <BriefcaseIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>
                  {user.occupation} @ <strong>{user.employer}</strong>
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-lg text-gray-300">
                <MapPinIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>{user.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full">
              <button
                className="flex-grow py-3 px-8 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg transition-all duration-300 ease-in-out
                                 hover:bg-indigo-500 hover:scale-105 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              >
                View My Work
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-grow py-3 px-8 rounded-lg bg-transparent text-indigo-300 font-semibold border border-indigo-500/50 
                                 transition-all duration-300 ease-in-out
                                 hover:bg-indigo-700/20 hover:border-indigo-500 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Abstract Element */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 overflow-hidden">
          {/* Abstract Glow Effect */}
          <div className="absolute w-72 h-72 lg:w-96 lg:h-96 bg-purple-800 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div
            className="absolute w-64 h-64 lg:w-80 lg:h-80 bg-indigo-800 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute w-56 h-56 lg:w-72 lg:h-72 bg-pink-800 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
