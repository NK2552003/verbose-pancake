import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const segments = [
  {
    color: "bg-orange-500",
    label: "Timer",
    packages: ["framer-motion", "gsap"],
  },
  {
    color: "bg-orange-300",
    label: "Animatable",
    packages: ["scrollreveal", "@studio-freight/lenis"],
  },
  {
    color: "bg-green-400",
    label: "Scope",
    packages: ["react", "react-dom", "next"],
  },
  {
    color: "bg-cyan-400",
    label: "Spring",
    packages: ["three", "@react-three/fiber"],
  },
  {
    color: "bg-orange-400",
    label: "Animation",
    packages: ["framer-motion"],
  },
]

// Estimated sizes in KB
const packageSizes = {
  "framer-motion": 40.5,
  "gsap": 26.7,
  "scrollreveal": 5.9,
  "react": 3.8,
  "react-dom": 38.7,
  "next": 86.5,
  "three": 92.0,
  "@react-three/fiber": 17.5,
  "lenis": 6.2,
}

const enrichedSegments = segments.map((seg) => {
  const size = seg.packages.reduce((total, pkg) => total + (packageSizes[pkg] || 0), 0)
  return { ...seg, size: parseFloat(size.toFixed(2)) }
})

const totalSize = enrichedSegments.reduce((sum, s) => sum + s.size, 0).toFixed(2)

const allPackages = [
  // Dependencies
  { name: '@emailjs/browser', version: '^4.4.1', type: 'dep' },
  { name: '@react-three/fiber', version: '^9.3.0', type: 'dep' },
  { name: '@studio-freight/lenis', version: '^1.0.42', type: 'dep' },
  { name: 'boxicons', version: '^2.1.4', type: 'dep' },
  { name: 'chart.js', version: '^4.4.8', type: 'dep' },
  { name: 'detect-gpu', version: '^5.0.70', type: 'dep' },
  { name: 'framer-motion', version: '^12.6.2', type: 'dep' },
  { name: 'gsap', version: '^3.12.7', type: 'dep' },
  { name: 'ioredis', version: '^5.6.0', type: 'dep' },
  { name: 'lenis', version: '^1.2.3', type: 'dep' },
  { name: 'locomotive-scroll', version: '^4.1.4', type: 'dep' },
  { name: 'lucide-react', version: '^0.479.0', type: 'dep' },
  { name: 'next', version: '^15.4.2', type: 'dep' },
  { name: 'node-cache', version: '^5.1.2', type: 'dep' },
  { name: 'octokit', version: '^4.1.2', type: 'dep' },
  { name: 'react', version: '^19.1.0', type: 'dep' },
  { name: 'react-chartjs-2', version: '^5.3.0', type: 'dep' },
  { name: 'react-dom', version: '^19.1.0', type: 'dep' },
  { name: 'react-hot-toast', version: '^2.5.2', type: 'dep' },
  { name: 'scrollreveal', version: '^4.0.9', type: 'dep' },
  { name: 'smooth-scrollbar', version: '^8.8.4', type: 'dep' },
  { name: 'three', version: '^0.179.1', type: 'dep' },
  // Dev Dependencies
  { name: '@tailwindcss/postcss', version: '^4', type: 'dev' },
  { name: '@types/jsmediatags', version: '^3.9.6', type: 'dev' },
  { name: '@types/locomotive-scroll', version: '^4.1.4', type: 'dev' },
  { name: '@types/node', version: '^20', type: 'dev' },
  { name: '@types/react', version: '^19', type: 'dev' },
  { name: '@types/react-dom', version: '^19', type: 'dev' },
  { name: '@types/scrollreveal', version: '^0.0.11', type: 'dev' },
  { name: '@types/three', version: '^0.178.1', type: 'dev' },
  { name: 'tailwindcss', version: '^4', type: 'dev' },
  { name: 'typescript', version: '^5', type: 'dev' },
];

export default function BundleSizeCard() {
  const [showPackages, setShowPackages] = useState(false);
  const [filter, setFilter] = useState('all');

  const dependencies = allPackages.filter(pkg => pkg.type === 'dep');
  const devDependencies = allPackages.filter(pkg => pkg.type === 'dev');
  
  const getFilteredPackages = () => {
    if (filter === 'dep') return dependencies;
    if (filter === 'dev') return devDependencies;
    return allPackages;
  };

  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const segmentVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: { 
      scaleX: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2
      }
    }
  };

  const labelVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const packageListVariants = {
    initial: { 
      opacity: 0,
      height: 0,
      y: -20
    },
    animate: { 
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.02
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const packageItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div 
      className="border border-white/20 p-4 rounded-xl text-white max-w-sm mx-auto absolute bottom-20 md:bottom-auto md:top-20 left-4 md:left-6 w-[90%] md:w-auto"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="flex justify-between items-center mb-2 text-teal-400"
        variants={labelVariants}
      >
        <span className="text-sm font-medium">Packages size</span>
        <motion.span 
          className="text-lg font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
        >
          {totalSize} KB
        </motion.span>
      </motion.div>
      
      <div className="flex h-2 w-full rounded-full overflow-hidden mb-3 bg-gray-700">
        {segments.map((seg, i) => (
          <motion.div 
            key={i} 
            className={`${seg.color}`} 
            style={{ flex: '1 0 auto', width: '8%' }}
            variants={segmentVariants}
            custom={i}
          />
        ))}
      </div>
      
      <motion.div 
        className="flex flex-wrap gap-x-3 text-xs mb-4"
        variants={labelVariants}
      >
        {segments.map((seg, i) => (
          <motion.div 
            key={i} 
            className="flex items-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          >
            <span className={`w-2 h-2 inline-block rounded-full ${seg.color}`} />
            <span>{seg.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="border-t border-gray-600 pt-3 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <motion.button 
            onClick={() => setShowPackages(!showPackages)}
            className="text-xs font-medium hover:text-teal-400 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {showPackages ? 'Hide' : 'Show'} Packages ({allPackages.length})
          </motion.button>
          
          <AnimatePresence>
            {showPackages && (
              <motion.div 
                className="flex gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {['all', 'dep', 'dev'].map((filterType) => (
                  <motion.button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      filter === filterType 
                        ? filterType === 'all' ? 'bg-teal-600' : filterType === 'dep' ? 'bg-teal-900' : 'bg-red-700'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {filterType === 'all' ? 'All' : filterType === 'dep' ? 'Deps' : 'Dev'}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {showPackages && (
            <motion.div 
              className="max-h-60 overflow-y-auto"
              variants={packageListVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="space-y-1">
                {getFilteredPackages().map((pkg, i) => (
                  <motion.div 
                    key={`${pkg.name}-${filter}`}
                    className="flex justify-between items-center text-xs py-1 border-b border-gray-700 last:border-b-0"
                    variants={packageItemVariants}
                    custom={i}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.span 
                        className={`w-1.5 h-1.5 rounded-full ${pkg.type === 'dep' ? 'bg-green-400' : 'bg-orange-400'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.02, type: "spring" }}
                      />
                      <span className="font-mono text-gray-300">{pkg.name}</span>
                    </div>
                    <span className="text-gray-500">{pkg.version}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-3 pt-2 border-t border-gray-600 flex justify-between text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <span>Dependencies: {dependencies.length}</span>
                <span>Dev: {devDependencies.length}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}