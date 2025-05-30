import { animate } from 'motion'
import React, { useRef } from 'react'

const TextSplit = ({text, ...props}) => {
  const containerRef = useRef(null)

  useEffect(() => {
      document.fonts.ready.then(() => {
          if (!containerRef.current) return
          containerRef.current.style.visibility = "visible"
          const { words } = splitText(
              containerRef.current.querySelector("h1")!
          )
          animate(
              words,
              { opacity: [0, 1], y: [10, 0] },
              {
                  type: "spring",
                  duration: 2,
                  bounce: 0,
                  delay: stagger(0.05),
              }
          )
      })
  }, [])

  return (
      <div className="container" ref={containerRef}>
          <h1 className="h1" {...props}>
              {text}
          </h1>
      </div>
  )
}

export default TextSplit
