"use client";

import { motion } from "framer-motion";
import { User, MapPin, Calendar, Mail } from "lucide-react";
import Image from "next/image";
export default function ProfileCard() {
  return (
    <motion.div
      className="absolute bottom-12 md:bottom-auto md:top-20 left-6 z-30 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="border border-gray-700/50 rounded-xl p-4 max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/pro.png"
              alt="Profile"
              width={100}
              height={100}
              className="object-cover"
              style={{
                borderTopLeftRadius: "40% 60%",
                borderTopRightRadius: "60% 40%",
                borderBottomRightRadius: "30% 70%",
                borderBottomLeftRadius: "70% 30%",
              }}
              priority
            />
          </div>
          <div>
            <h3 className="text-red-400 font-semibold text-base">Nitish K.</h3>
            <p className="text-gray-400 text-xs">Full Stack Developer</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin size={12} className="text-[#8c8b8b]" />
            <span>Sonipat, Haryana, India</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={12} className="text-[#8c8b8b]" />
            <span>1+ years experience</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Mail size={12} className="text-[#8c8b8b]" />
            <span>nk2552003@gmail.com</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-gray-400 text-xs leading-relaxed">
            Passionate about creating innovative solutions with modern
            technologies.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
