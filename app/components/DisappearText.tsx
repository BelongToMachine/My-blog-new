import { motion, Variants } from "framer-motion"

const DisappearingText = ({
  text,
  variant,
  isCollapse,
}: {
  text: string
  variant: Variants
  isCollapse: boolean
}) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={variant}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={{
            index,
            textLength: text.length,
            isCollapse,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export default DisappearingText
