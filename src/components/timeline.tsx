import { motion } from "framer-motion";
import React, { useEffect } from "react";

// Define the type for the timeline data
interface TimelineItem {
  id: number;
  title: string;
  date: string;
  description: string;
}

// Timeline data
const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Secondary School",
    date: "2018-2019",
    description:
      "I completed my 10th grade at Honey Modern High School in Sonipat, Haryana, under the Haryana Board of School Education (HBSE). The curriculum emphasized subjects like mathematics, science, and social studies, laying the foundation for my further studies in computer science. I performed well academically, achieving 87.6%, which was a great motivator for my subsequent educational pursuits.",
  },
  {
    id: 2,
    title: "Senior Secondary School",
    date: "2020-2021",
    description:
      "I completed my Senior Secondary (12th) education at Hindu Sr. Sec. School, Sonipat, Haryana, under the Central Board of Secondary Education (CBSE). This phase focused on subjects like physics, chemistry, mathematics, and computer science, further strengthening my interest in technology and programming. I scored 80.2% in my final exams, which helped secure my place in a reputed B.Tech. program.",
  },
  {
    id: 3,
    title: "Web Development Internship",
    date: "Aug-Oct 2023",
    description:
      "I completed a Web Development Internship via Internshala, where I worked on real-world web development projects, learning how to build and maintain websites. During this period, I gained practical experience in HTML, CSS, JavaScript, and web frameworks like React and Node.js. I received a performance score of 67% for my work, which included building responsive websites and collaborating with developers on various tasks.",
  },
  {
    id: 4,
    title: "Flutter & Dart Course",
    date: "Apr-Jun 2024",
    description:
      "In June 2024, I completed a comprehensive online course on Flutter & Dart via Udemy. This course introduced me to mobile app development, focusing on building cross-platform applications with a single codebase. I learned how to design responsive user interfaces, manage state, and connect to APIs, giving me the skills to develop apps for both Android and iOS platforms.",
  },
  {
    id: 5,
    title: "React Course",
    date: "July 2025",
    description:
      "Currently, I am enrolled in an online React course on Udemy, which focuses on mastering React.js for building modern web applications. The course covers core concepts like JSX, components, props, state, hooks, and routing. I am learning how to create dynamic, single-page applications that are fast and responsive. This course will help me enhance my web development skills, enabling me to build scalable and maintainable projects using the popular React framework.",
  },
  {
    id: 6,
    title: "UnderGraduation 2022-2026",
    date: "2022-2026",
    description:
      "I am currently pursuing my Bachelor of Technology (B.Tech.) degree in Computer Science at Tula's Institute, Dehradun. The institute is affiliated with Veer Madhav Singh Bhandari Uttarakhand Technical University (VMSBUTU), and the course spans four years, focusing on various fields of computer science and engineering. My academic journey includes hands-on experience with programming languages, algorithms, data structures, and software development. So far, I've achieved a CGPA of 7.5 in the 1st year, 7.69 in the 2nd year, and I am currently continuing my studies in the 3rd year.",
  },
];


const Timeline: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative z-10 page">
      <motion.div
        className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4 mb-30"
        id="quali"
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent text-center lg:text-start"
              style={{
                WebkitTextStroke: "0.5px white",
                WebkitTextFillColor: "transparent",
              }}
              custom={0.2}
            >
              My Professional Journey
            </motion.h1>
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-white/80"
          variants={childVariants}
        >
          Explore my Skills, Achievements, and the Milestones that define my career.
        </motion.p>
      </motion.div>
      <div className="page timeline-5-2" data-uia-timeline-skin="5" data-uia-timeline-adapter-skin-5="uia-card">
        <div className="uia-timeline sm:px-22">
          <div className="uia-timeline__container">
            <div className="uia-timeline__line"></div>
            <div className="uia-timeline__groups">
              {timelineData.map((item, index) => (
                <motion.section
                  key={item.id}
                  className="timeline-item uia-timeline__group"
                  aria-labelledby={`timeline-demo-6-heading-${item.id}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="uia-timeline__dot"></div>
                  <div className="uia-timeline__point uia-card">
                    <div className="uia-card__container">
                      <div className="uia-card__intro">
                        <h3
                          id={`timeline-demo-6-heading-${item.id}`}
                          className="page__job-name uia-heading ra-heading text-2xl text-white"
                        >
                          {item.title}
                        </h3>
                        <p className="uia-card__time text-white/80">{item.date}</p>
                      </div>
                      <motion.div
                        className="uia-card__body text-white/70 mb-8 sm:mb-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-xs md:text-sm lg:text-base">{item.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
