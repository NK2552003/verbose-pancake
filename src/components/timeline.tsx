import React from 'react';
import 'boxicons/css/boxicons.min.css'; // Import Boxicons CSS

const Timeline = () => {
  const timelineData = [
    {
      id: 1,
      title: "Secondary School",
      date: "2018-2019",
      description: "I completed my 10th grade at Honey Modern High School in Sonipat, Haryana, under the Haryana Board of School Education (HBSE). The curriculum emphasized subjects like mathematics, science, and social studies, laying the foundation for my further studies in computer science. I performed well academically, achieving 87.6%, which was a great motivator for my subsequent educational pursuits.",
    },
    {
      id: 2,
      title: "Senior Secondary School",
      date: "2020-2021",
      description: "I completed my Senior Secondary (12th) education at Hindu Sr. Sec. School, Sonipat, Haryana, under the Central Board of Secondary Education (CBSE). This phase focused on subjects like physics, chemistry, mathematics, and computer science, further strengthening my interest in technology and programming. I scored 80.2% in my final exams, which helped secure my place in a reputed B.Tech. program.",
    },
    {
      id: 3,
      title: "Web Development Internship",
      date: "Aug-Oct 2023",
      description: "I completed a Web Development Internship via Internshala, where I worked on real-world web development projects, learning how to build and maintain websites. During this period, I gained practical experience in HTML, CSS, JavaScript, and web frameworks like React and Node.js. I received a performance score of 67% for my work, which included building responsive websites and collaborating with developers on various tasks.",
    },
    {
      id: 4,
      title: "Flutter & Dart Course",
      date: "Apr-Jun 2024",
      description: "In June 2024, I completed a comprehensive online course on Flutter & Dart via Udemy. This course introduced me to mobile app development, focusing on building cross-platform applications with a single codebase. I learned how to design responsive user interfaces, manage state, and connect to APIs, giving me the skills to develop apps for both Android and iOS platforms.",
    },
    {
      id: 5,
      title: "React Course (In Progress)",
      date: "Mar 2025",
      description: "Currently, I am enrolled in an online React course on Udemy, which focuses on mastering React.js for building modern web applications. The course covers core concepts like JSX, components, props, state, hooks, and routing. I am learning how to create dynamic, single-page applications that are fast and responsive. This course will help me enhance my web development skills, enabling me to build scalable and maintainable projects using the popular React framework.",
    },
    {
      id: 6,
      title: "UnderGraduation 2022-2026",
      date: "2022-2026",
      description: "I am currently pursuing my Bachelor of Technology (B.Tech.) degree in Computer Science at Tula's Institute, Dehradun. The institute is affiliated with Veer Madhav Singh Bhandari Uttarakhand Technical University (VMSBUTU), and the course spans four years, focusing on various fields of computer science and engineering. My academic journey includes hands-on experience with programming languages, algorithms, data structures, and software development. So far, I've achieved a CGPA of 7.5 in the 1st year, 7.69 in the 2nd year, and I am currently continuing my studies in the 3rd year.",
    }
  ];

  // Map item IDs to Boxicon class names
  const iconMap = {
    1: 'bx bxs-school', // School icon
    2: 'bx bxs-graduation', // Graduation icon
    3: 'bx bx-laptop', // Laptop icon
    4: 'bx bxs-mobile', // Mobile icon
    5: 'bx bx-code-alt', // Code icon
    6: 'bx bxs-book', // Book icon
  };

  return (
    <div className="page bg-gradient-to-t from-[#031412] to-transparent">
        <div className="flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4 mb-30" id="quali">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 mt-20">My Professional Journey</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80">
              Explore my Skills, Achievements, and the Milestones that defines my career
            </p>
        </div>
      <div className="uia-timeline" data-uia-timeline-skin="1">
        <div className="uia-timeline__container sm:mx-12 sm:mr-30 sm:ml-20">
          <div className="uia-timeline__groups">
            {timelineData.map((item) => (
              <section key={item.id} className="uia-timeline__group" aria-labelledby={`uia-timeline-step-desc-${item.id}`}>
                <div className="uia-timeline__point uia-card">
                  <div className="uia-card__container mb-12">
                    <div className="uia-timeline__point-intro uia-card__intro">
                      <span className="uia-timeline__step" aria-hidden="true">
                        <i className={`${iconMap[item.id] || 'bx bx-question-mark'}`} /> {/* Render Boxicon with fallback */}
                      </span>
                      <h3 id={`uia-timeline-step-desc-${item.id}`} className="relative uia-timeline__point-heading ra-heading sm:pl-12 sm:top-[-10px]">
                        <time dateTime={item.date}>{item.date}</time>
                      </h3>
                      <span className="uia-timeline__point-date uia-card__time text-2xl">
                      {item.title}
                      </span>
                    </div>
                    <div className="uia-card__body uia-timeline__point-description">
                      <div className="uia-card__description sm:pl-10 sm:pr-20 text-white/80 sm:text-md">
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;