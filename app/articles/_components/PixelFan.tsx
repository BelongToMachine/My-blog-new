import Image from "next/image"
import fan from "@/public/images/fan_8bit.png"
import styles from "./PixelFan.module.css"

interface PixelFanProps {
  size?: number
}

export function PixelFan({ size = 130 }: PixelFanProps) {
  return (
    <div
      aria-label="Spinning retro fan"
      className={styles.fanWrapper}
      style={{ width: size, height: size }}
    >
      <Image
        alt="retro fan"
        className={`pixelated ${styles.fanBase}`}
        draggable={false}
        fill
        priority
        src={fan}
      />
      <Image
        alt=""
        aria-hidden="true"
        className={`pixelated ${styles.fanBlades}`}
        draggable={false}
        fill
        src={fan}
      />
    </div>
  )
}
