import React from "react"
import styles from "@/app/components/IIIDButton.module.css"
import { Button } from "@radix-ui/themes"

interface Props {
  text: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  attri?: React.CSSProperties
}

const IIIDButton = ({ text, onClick, disabled, attri }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.pushable}
      style={{
        ...attri,
      }}
    >
      <span className={styles.shadow}></span>
      <span className={styles.edge}></span>
      <span className={styles.front}>{text}</span>
    </button>
  )
}

export default IIIDButton
