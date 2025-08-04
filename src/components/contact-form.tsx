"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"

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
  const formRef = React.useRef(null)
  const isInView = useInView(formRef, { once: true, amount: 0.3 })

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
      const response = await emailjs.send("service_uqdb0rx", "template_5w14gcl", {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        delay: 0.6
      }
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        ref={formRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 sm:p-8 md:p-10">
          <form onSubmit={sendEmail} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/60 text-white"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300/50 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/60 text-white"
                  required
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-white">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                className="w-full px-3 py-2 border border-gray-300/60 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/60 min-h-[150px] resize-y text-white"
                required
              />
            </motion.div>

            <div className="pt-2 flex items-center justify-center text-center">
              <motion.button
                variants={buttonVariants}
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
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
