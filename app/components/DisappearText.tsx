import { motion, Variants } from "framer-motion"

const DisappearingText = ({
  text,
  variant,
}: {
  text: string
  variant: Variants
}) => {
  const variants = {
    initial: { opacity: 0 },
    animate: (index: number) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: index * 0.05 }, // Letter by letter fade-in
    }),
    exit: (index: number) => ({
      opacity: 0,
      transition: {
        duration: 0.5,
        delay: (text.length - index - 1) * 0.05, // Letter by letter fade-out
      },
    }),
  }

  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={index}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export default DisappearingText
