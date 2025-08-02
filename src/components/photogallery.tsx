
import { motion } from "framer-motion"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"

const tabs = [
  { id: "image", label: "Image", active: true },
  { id: "illustration", label: "Illustration", active: false },
  { id: "video", label: "Video", active: false },
]

const filters = ["All", "Sports", "Architecture", "Fashion", "Interiors", "Animals", "Lifestyle", "Travel", "Nature"]

interface ImageItem {
  id: number
  src: string
  speed: number
  size: "small" | "normal" | "big"
  orientation: "vertical" | "horizontal"
  zIndex: number
  alt: string
  category: string
  aspectRatio: string
  width?: number
  height?: number
  loaded?: boolean
}

const generateRandomZIndex = () => Math.floor(Math.random() * 100) + 1

const allImages: ImageItem[] = [
  {
    id: 1,
    src: "/20.jpg",
    speed: 2,
    size: "normal",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Nature",
    aspectRatio: "4/5",
  },
  {
    id: 2,
    src: "/1.jpg",
    speed: 1,
    size: "big",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Architecture",
    aspectRatio: "3/4",
  },
  {
    id: 3,
    src: "/3.jpeg",
    speed: 4,
    size: "small",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Lifestyle",
    aspectRatio: "3/2",
  },
  {
    id: 4,
    src: "/4.jpeg",
    speed: 3,
    size: "normal",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Fashion",
    aspectRatio: "4/5",
  },
  {
    id: 5,
    src: "/5.jpeg",
    speed: 2,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Travel",
    aspectRatio: "3/2",
  },
  {
    id: 6,
    src: "/6.jpg",
    speed: 1,
    size: "big",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Nature",
    aspectRatio: "4/3",
  },
  {
    id: 7,
    src: "/7.jpg",
    speed: 2,
    size: "small",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Animals",
    aspectRatio: "3/4",
  },
  {
    id: 8,
    src: "/8.jpg",
    speed: 4,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Architecture",
    aspectRatio: "3/2",
  },
  {
    id: 9,
    src: "/9.jpg",
    speed: 3,
    size: "small",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Lifestyle",
    aspectRatio: "3/2",
  },
  {
    id: 10,
    src: "/10.jpg",
    speed: 2,
    size: "big",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Fashion",
    aspectRatio: "3/4",
  },
  {
    id: 11,
    src: "/11.jpg",
    speed: 1,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Travel",
    aspectRatio: "3/2",
  },
  {
    id: 12,
    src: "/12.png",
    speed: 3,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Illustration",
    aspectRatio: "3/2",
  },
  {
    id: 13,
    src: "/13.jpg",
    speed: 2,
    size: "small",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Nature",
    aspectRatio: "3/2",
  },
  {
    id: 14,
    src: "/14.jpg",
    speed: 1,
    size: "big",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Architecture",
    aspectRatio: "3/4",
  },
  {
    id: 15,
    src: "/15.jpg",
    speed: 2,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Lifestyle",
    aspectRatio: "3/2",
  },
  {
    id: 16,
    src: "/16.jpg",
    speed: 4,
    size: "small",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Animals",
    aspectRatio: "3/2",
  },
  {
    id: 17,
    src: "/17.jpg",
    speed: 2,
    size: "big",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Fashion",
    aspectRatio: "3/4",
  },
  {
    id: 18,
    src: "/18.jpg",
    speed: 3,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Travel",
    aspectRatio: "3/2",
  },
  {
    id: 19,
    src: "/19.jpg",
    speed: 1,
    size: "small",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Nature",
    aspectRatio: "3/2",
  },
  {
    id: 20,
    src: "/20.jpg",
    speed: 2,
    size: "normal",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Architecture",
    aspectRatio: "4/5",
  },
  {
    id: 21,
    src: "/21.jpg",
    speed: 3,
    size: "normal",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Lifestyle",
    aspectRatio: "3/2",
  },
  {
    id: 22,
    src: "/22.jpg",
    speed: 2,
    size: "big",
    orientation: "horizontal",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Fashion",
    aspectRatio: "4/3",
  },
  {
    id: 23,
    src: "/23.jpg",
    speed: 4,
    size: "small",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Animals",
    aspectRatio: "3/4",
  },
  {
    id: 24,
    src: "/24.jpg",
    speed: 3,
    size: "normal",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Travel",
    aspectRatio: "4/5",
  },
  {
    id: 25,
    src: "/26.jpg",
    speed: 1,
    size: "big",
    orientation: "vertical",
    zIndex: generateRandomZIndex(),
    alt: "Gallery image",
    category: "Nature",
    aspectRatio: "3/4",
  },
]

// Custom masonry layout hook
const useMasonryLayout = (items: ImageItem[], columns: number) => {
  const [columnItems, setColumnItems] = useState<ImageItem[][]>([])

  useEffect(() => {
    if (items.length === 0) {
      setColumnItems([])
      return
    }

    // Initialize columns
    const cols: ImageItem[][] = Array(columns).fill(null).map(() => [])
    const colHeights = Array(columns).fill(0)

    // Distribute items to columns
    items.forEach((item) => {
      // Find the shortest column
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights))
      
      // Add item to shortest column
      cols[shortestColIndex].push(item)
      
      // Estimate height based on aspect ratio (for better distribution)
      const estimatedHeight = item.aspectRatio ? 
        300 / parseFloat(item.aspectRatio.split('/')[0]) * parseFloat(item.aspectRatio.split('/')[1]) : 300
      
      colHeights[shortestColIndex] += estimatedHeight + 16 // 16px for margin
    })

    setColumnItems(cols)
  }, [items, columns])

  return columnItems
}
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isIntersecting] as const
}

// Image component with lazy loading and resolution detection
const LazyImage = ({ image, onLoad }: { image: ImageItem; onLoad: (img: ImageItem, width: number, height: number) => void }) => {
  const [ref, isIntersecting] = useIntersectionObserver()
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setLoaded(true)
    onLoad(image, img.naturalWidth, img.naturalHeight)
  }, [image, onLoad])

  const handleImageError = useCallback(() => {
    setError(true)
  }, [])

  return (
    <div ref={ref} className="group cursor-pointer w-full">
      <motion.div
  ref={ref}
  className="group cursor-pointer w-full"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={loaded ? { opacity: 1, scale: 1 } : {}}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
       <div className="relative overflow-hidden rounded-lg sm:rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl w-full">
        {isIntersecting ? (
          <>
            {!loaded && !error && (
              <div 
                className="w-full bg-gray-800 animate-pulse rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ 
                  aspectRatio: image.aspectRatio, 
                  minHeight: '120px'
                }}
              >
                <div className="text-gray-400 text-xs sm:text-sm">Loading...</div>
              </div>
            )}
            {error ? (
              <div 
                className="w-full bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ 
                  aspectRatio: image.aspectRatio, 
                  minHeight: '120px'
                }}
              >
                <div className="text-gray-400 text-xs sm:text-sm">Failed to load</div>
              </div>
            ) : (
              <img
                src={image.src}
                alt={image.alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`w-full h-auto object-cover transition-all duration-300 group-hover:opacity-90 ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  aspectRatio: image.aspectRatio,
                  display: 'block',
                  maxWidth: '100%'
                }}
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            {loaded && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-opacity-60 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {image.width && image.height ? `${image.width}×${image.height}` : 'Loading...'}
              </div>
            )}
          </>
        ) : (
          <div 
            className="w-full animate-pulse rounded-lg sm:rounded-xl"
            style={{ 
              aspectRatio: image.aspectRatio, 
              minHeight: '120px'
            }}
          />
        )}
      </div>
</motion.div>


    </div>
  )
}

export default function MasonryGallery() {
  const [activeTab, setActiveTab] = useState("image")
  const [activeFilter, setActiveFilter] = useState("All")
  const [images, setImages] = useState<ImageItem[]>([])
  const [displayCount, setDisplayCount] = useState(9) // Show 3 rows initially (approximately 9 images)
  const [loading, setLoading] = useState(false)

  // Responsive columns
  const [columns, setColumns] = useState(2)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1280) setColumns(5) // xl
      else if (width >= 1024) setColumns(4) // lg
      else if (width >= 768) setColumns(3) // md
      else setColumns(2) // mobile
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Initialize with first batch of images
  useEffect(() => {
    setImages(allImages.slice(0, displayCount))
  }, [displayCount])

  const handleImageLoad = useCallback((img: ImageItem, width: number, height: number) => {
    setImages(prev => prev.map(image => 
      image.id === img.id 
        ? { ...image, width, height, loaded: true }
        : image
    ))
  }, [])

  const filteredImages = activeFilter === "All" ? images : images.filter((img) => img.category === activeFilter)
  
  // Use custom masonry layout
  const columnItems = useMasonryLayout(filteredImages, columns)

  const loadMore = () => {
    setLoading(true)
    setTimeout(() => {
      const newCount = Math.min(displayCount + 3, allImages.length) // Load approximately 1 row (3 images) at a time
      setDisplayCount(newCount)
      setLoading(false)
    }, 500) // Simulate loading delay
  }

  const hasMore = displayCount < allImages.length

  return (
    <div className="text-white p-2 sm:p-4 md:p-6">
           {/* Stats */}
        <div className=" text-center md:text-end mb-4  text-gray-400 text-sm md:px-10">
          Showing {filteredImages.length} of {activeFilter === "All" ? allImages.length : allImages.filter(img => img.category === activeFilter).length} images
        </div>
      <div className=" md:px-10 w-full overflow-hidden">
        {/* Stable Masonry Layout */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 items-start w-full">
          {columnItems.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 md:gap-4">
              {column.map((image) => (
                <LazyImage
                  key={image.id}
                  image={image}
                  onLoad={handleImageLoad}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}