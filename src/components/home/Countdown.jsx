import { useEffect, useState } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

function remaining(target) {
  let diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / 86400000)
  diff -= days * 86400000
  const hours = Math.floor(diff / 3600000)
  diff -= hours * 3600000
  const mins = Math.floor(diff / 60000)
  diff -= mins * 60000
  return { days, hours, mins, secs: Math.floor(diff / 1000) }
}

export default function Countdown({ event }) {
  const target = event?.start_datetime ? new Date(event.start_datetime).getTime() : null
  const isValidTarget = target !== null && !Number.isNaN(target)

  const [time, setTime] = useState(() => (isValidTarget ? remaining(target) : null))

  useEffect(() => {
    if (!isValidTarget) {
      setTime(null)
      return undefined
    }

    const tick = () => setTime(remaining(target))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [target, isValidTarget])

  if (!isValidTarget || !time) return null

  const boxes = [
    ['Days', time.days],
    ['Hours', time.hours],
    ['Minutes', time.mins],
    ['Seconds', time.secs],
  ]

  return (
    <section className="section countdown-section">
      <div className="container">
        <div className="eyebrow reveal">Countdown</div>
        <h2 className="h-lg reveal">{event.title} Begins In</h2>
        <div className="countdown-grid" id="countdown">
          {boxes.map(([label, value], i) => (
            <div key={label} className={`count-box reveal${i ? ` reveal-delay-${i}` : ''}`}>
              <div className="val">{pad(value)}</div>
              <div className="lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
