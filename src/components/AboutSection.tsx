import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  const skills = [
    "NEXT.JS", "REACT", "TYPESCRIPT", "FLUTTER", "DART", "JAVASCRIPT",
    "PYTHON", "SUPABASE", "FIREBASE", "INNGEST", "FROG FRAMEWORK",
    "SQL DATABASE", "MOBILE DEVELOPMENT", "WEB DEVELOPMENT", "FULL STACK", "RESPONSIVE DESIGN"
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section>
      <motion.div
        className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4 mb-12 px-3"
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20"
          custom={0}
          variants={fadeInUp}
        >
          A Glimpse Into My World
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/80"
          custom={0.1}
          variants={fadeInUp}
        >
          Learn more about who I am, what I do, and what inspires me.
        </motion.p>
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-end lg:pr-10 order-1 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="relative p-4">
              <Image
                src="/pro.png"
                alt="Profile"
                width={300}
                height={300}
                className="object-cover w-full max-w-sm mx-auto"
                style={{
                  borderTopLeftRadius: "40% 60%",
                  borderTopRightRadius: "60% 40%",
                  borderBottomRightRadius: "30% 70%",
                  borderBottomLeftRadius: "70% 30%",
                }}
                priority
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="order-2 lg:order-2 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent text-center lg:text-start"
              style={{
                WebkitTextStroke: "0.5px white",
                WebkitTextFillColor: "transparent",
              }}
              custom={0.2}
              variants={fadeInUp}
            >
              Hi there!
            </motion.h1>

            <motion.p
              className="text-sm md:text-base lg:text-xl text-gray-300/80 leading-relaxed font-extralight lg:pr-20 text-center lg:text-start px-4 lg:px-0"
              custom={0.3}
              variants={fadeInUp}
            >
              Fuelled by a passion for developing innovative mobile and web
              applications, I have a deep desire to excel and continuously
              improve in my development skills.
              <span className="hidden lg:block">
                Specializing in modern frameworks and databases, learn more
                about my technical journey below.
              </span>
            </motion.p>
          </motion.div>
        </div>

        {/* Career Section */}
        <motion.div
          className="mt-16 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <motion.div variants={fadeInUp} custom={0.4}>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent text-center lg:text-end"
                style={{
                  WebkitTextStroke: "0.5px white",
                  WebkitTextFillColor: "transparent",
                }}
              >
                My Journey So Far
              </h2>
              <p className="text-gray-300/80 text-sm md:text-base lg:text-xl leading-relaxed text-center lg:text-end px-4 lg:px-0">
                Always up for a challenge, I have built various mobile and web
                applications using modern technologies. As a final year BTech
                CSE student, I've developed projects with Next.js, React, and
                Flutter, creating both responsive web applications and
                cross-platform mobile apps. I've gained hands-on experience with
                databases like Supabase and Firebase, and have worked with
                backend technologies including Python and Inngest for workflow
                automation.
              </p>
            </motion.div>

            {/* Skills Tags */}
            <motion.div
              className="flex flex-col items-center justify-center lg:pr-20"
              variants={fadeInUp}
              custom={0.5}
            >
              <motion.div
                className="flex flex-wrap gap-2 lg:gap-3 items-center justify-center lg:justify-start"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-xs lg:text-sm font-medium text-gray-200 hover:bg-gray-700 hover:border-gray-600 transition-colors duration-200"
                    variants={fadeInUp}
                    custom={0.05 * index}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
