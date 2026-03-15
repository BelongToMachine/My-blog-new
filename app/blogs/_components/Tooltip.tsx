import React from "react"
import styles from "./tooltip.module.css" // Import the CSS Module

const Tooltip = ({ text }: { text: string }) => {
  return (
    <div
      className="absolute bottom-full z-10 w-64 -translate-x-1/2 transform"
      style={{
        left: "90%",
      }}
    >
      <div className={`${styles.tooltip}`}>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default Tooltip
