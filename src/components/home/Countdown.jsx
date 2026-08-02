import { useEffect, useState } from 'react'
import { EVENTS } from '../../data/siteData'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const upcoming = EVENTS.find((e) => e.status === 'upcoming')
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    if (!upcoming) return undefined

    const target = new Date(`${upcoming.date}T10:00:00`).getTime()

    const tick = () => {
      const now = Date.now()
      let diff = Math.max(0, target - now)
      const days = Math.floor(diff / 86400000)
      diff -= days * 86400000
      const hours = Math.floor(diff / 3600000)
      diff -= hours * 3600000
      const mins = Math.floor(diff / 60000)
      diff -= mins * 60000
      const secs = Math.floor(diff / 1000)
      setTime({ days, hours, mins, secs })
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [upcoming])

  if (!upcoming) return null

  return (
    <section className="section countdown-section">
      <div className="container">
        <div className="eyebrow reveal">Countdown</div>
        <h2 className="h-lg reveal">
          {upcoming.theme} {upcoming.year} Begins In
        </h2>
        <div className="countdown-grid" id="countdown">
          <div className="count-box reveal">
            <div className="val" id="cd-days">
              {pad(time.days)}
            </div>
            <div className="lbl">Days</div>
          </div>
          <div className="count-box reveal reveal-delay-1">
            <div className="val" id="cd-hours">
              {pad(time.hours)}
            </div>
            <div className="lbl">Hours</div>
          </div>
          <div className="count-box reveal reveal-delay-2">
            <div className="val" id="cd-mins">
              {pad(time.mins)}
            </div>
            <div className="lbl">Minutes</div>
          </div>
          <div className="count-box reveal reveal-delay-3">
            <div className="val" id="cd-secs">
              {pad(time.secs)}
            </div>
            <div className="lbl">Seconds</div>
          </div>
        </div>
      </div>
    </section>
  )
}
