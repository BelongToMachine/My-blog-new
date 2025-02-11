import React from "react"
import styled from "styled-components"

// Tooltip Container
const TooltipWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
`

// Tooltip Box
const TooltipBox = styled.div`
  position: relative;
  background: linear-gradient(
    286deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(51, 207, 205, 1) 0%,
    rgba(49, 207, 207, 1) 53%,
    rgba(0, 212, 255, 1) 100%
  );
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
`

// Tooltip Arrow (Triangle)
const TooltipArrow = styled.div`
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #333;
  background: linear-gradient(
    286deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(51, 207, 205, 1) 0%,
    rgba(49, 207, 207, 1) 53%,
    rgba(0, 212, 255, 1) 100%
  );
`

const Tooltip = ({ text }: { text: string }) => {
  return (
    <TooltipWrapper>
      <TooltipBox>
        {text}
        <TooltipArrow />
      </TooltipBox>
    </TooltipWrapper>
  )
}

export default Tooltip
