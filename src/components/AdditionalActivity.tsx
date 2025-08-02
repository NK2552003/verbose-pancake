import { motion } from "framer-motion";
import MasonryGallery from "./photogallery";

const GridLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2 gap-6 sm:mx-4">
      {/* Animated Heading */}
      <motion.div 
        className="sr-heading flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] text-center text-white relative z-10 p-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
           <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent text-center lg:text-start"
              style={{
                WebkitTextStroke: "0.5px white",
                WebkitTextFillColor: "transparent",
              }}
              custom={0.2}
            >
              Beyond the Code
            </motion.h1>
        <p className="text-sm sm:text-base md:text-lg text-white/80">
          Explore my photography skills
        </p>
      </motion.div>

      {/* Non-animated Gaming Interface */}
      <motion.div 
        className="flex-grow rounded-md w-full mt-12 h-auto mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <MasonryGallery/>
      </motion.div>
    </div>
  );
};

export default GridLayout;