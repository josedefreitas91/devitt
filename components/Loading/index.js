import Image from "next/image"

export default function Loading({ width = 25, height = 25 }) {
  return (
    <Image src="/loading.gif" width={width} height={height} alt="loading" />
  )
}
