"use client"

import { useEffect, useRef } from "react"

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

export function CharcoalSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const sparks: Spark[] = []
    const colors = ["#FFD700", "#FFA500", "#FF6B00", "#FF4500", "#FF8C00"]
    const maxSparks = 10

    const createSpark = () => {
      if (sparks.length >= maxSparks) return

      const spark: Spark = {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 2 + 3),
        life: 1,
        maxLife: Math.random() * 60 + 40,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
      sparks.push(spark)
    }

    const updateSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]

        spark.x += spark.vx
        spark.y += spark.vy
        spark.vy += 0.05
        spark.vx *= 0.99

        spark.life++

        if (spark.life >= spark.maxLife || spark.y > canvas.height) {
          sparks.splice(i, 1)
        }
      }
    }

    const drawSparks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparks.forEach((spark) => {
        const opacity = 1 - spark.life / spark.maxLife
        ctx.fillStyle = spark.color
        ctx.globalAlpha = opacity * 0.9

        ctx.beginPath()
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
        ctx.fill()

        const glowSize = spark.size * 3
        const gradient = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, glowSize)
        gradient.addColorStop(0, spark.color)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.globalAlpha = opacity * 0.5
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
    }

    let lastSparkTime = 0
    const animate = (timestamp: number) => {
      if (timestamp - lastSparkTime > 200 + Math.random() * 300) {
        createSpark()
        lastSparkTime = timestamp
      }

      updateSparks()
      drawSparks()
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
}
