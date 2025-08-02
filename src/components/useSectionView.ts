import { useEffect, useState } from "react"

export const useSectionInView = (id: string, threshold = 0.5) => {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = document.getElementById(id)
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [id, threshold])

  return inView
}
