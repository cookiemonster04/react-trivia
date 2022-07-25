import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
// import Confetti from 'react-dom-confetti'; // Alternate confetti

/* Alternate confetti config
const config = {
    angle: "0",
    spread: 360,
    startVelocity: "20",
    elementCount: "200",
    dragFriction: "0.13",
    duration: 3000,
    stagger: "1",
    width: "8px",
    height: "8px",
    perspective: "1000px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
}; */

/* Source: https://www.npmjs.com/package/react-confetti */

export default () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={500}
      recycle={false}
      gravity={0.5}
    />
  )
}