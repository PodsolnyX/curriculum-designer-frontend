import { useViewScale } from '@/pages/PlanView/hooks/useViewScale.ts';

export const ScaleOffsetTop = () => {

  const scale = useViewScale()

  return (
    <div
      style={{
        width: "100%",
        height: 80 * Math.min(1 / scale, 2.5),
        background: "#f5f5f4",
      }}
    />
  )
}

export const ScaleOffsetRight = () => {

  const scale = useViewScale()

  return (
    <div
      style={{
        gridColumn: "6",
        gridRow: "1 / -1",
        width: 400 * Math.min(1 / scale, 1.3),
        background: "#f5f5f4",
        marginLeft: 30
      }}
    />
  )
}