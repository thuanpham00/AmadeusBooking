import { useEffect, useState } from "react"

export default function useScrollHeader(threshold: number) {
  const [showHeader, setShowHeader] = useState(false)
  const [scrollWindow, setScrollWindow] = useState(0)

  const handleScrollWindow = () => {
    const currentScrollY = window.scrollY
    setScrollWindow(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollWindow)

    return () => window.removeEventListener("scroll", handleScrollWindow)
  }, [])

  // nếu scrollWindow có thay đổi thì nó tham chiếu tới chạy lại hàm này
  useEffect(() => {
    setShowHeader(scrollWindow > threshold) // nếu > thì => true // còn <= => false
  }, [showHeader, scrollWindow, threshold])

  return { showHeader }
}
