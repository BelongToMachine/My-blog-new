import React from "react"
import styles from "./tooltip.module.css" // Import the CSS Module

const Tooltip = ({ text }: { text: string }) => {
  return (
    <div
      className="absolute bottom-full transform -translate-x-1/2 w-64 z-10"
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
