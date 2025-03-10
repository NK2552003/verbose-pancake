"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import emailjs from "@emailjs/browser"

// EmailJS types
interface EmailJSResponseStatus {
  status: number
  text: string
}

interface EmailJSError {
  text: string
}

export default function ContactForm() {

  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      emailjs.init("jm_Y0wAADmEd2gYlo")
    }
  }, [])
  

  const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Get form data
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    try {
      const response = await emailjs.send("service_z32dfnp", "template_5w14gcl", {
        name,
        email,
        message,
      })

      console.log("SUCCESS!", response.status, response.text)
      toast.success("Your message has been sent successfully.")

      // Reset form
      if (event.currentTarget) {
        event.currentTarget.reset()
      }
    } catch (error) {
      console.error("FAILED...", error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#031412] rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10">
          <form onSubmit={sendEmail} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-white">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[150px] resize-y text-white"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-center text-center">
              <button
                 type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                            className="relative inline-block p-px font-semibold leading-6 text-white bg-white/20 shadow-2xl cursor-pointer rounded-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 text-xs sm:text-base"
                        >
                            <span
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-[#18786E] to-[#29CEB9] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            ></span>

                            <span className="relative z-10 block px-3 py-1.5 sm:px-6 sm:py-3 rounded-2xl bg-[#031412] hover:text-[#a0f7eb]">
                                <div className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                                    <span className="transition-all duration-500 group-hover:translate-x-1">
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    </span>
                                </div>
                            </span>
                        </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}