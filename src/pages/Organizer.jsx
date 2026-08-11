import { useCallback, useEffect, useState } from 'react'
import {
  downloadAttendeeCsv,
  fetchAnalytics,
  fetchDashboard,
  fetchEvents,
  volunteerLogin,
} from '../api/services'
import { getVolunteerName, storeTokens } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/format'
import AsyncBoundary from '../components/common/AsyncBoundary'

/** How often the numbers refresh. Short, because this is watched at the door. */
const POLL_MS = 15000

export default function Organizer() {
  const { user, loading, refresh, signOut } = useAuth()

  // Role, not token presence — see the same note in CheckIn.jsx.
  const isOrganizer = Boolean(user?.is_organizer)

  if (loading) {
    return (
      <div className="async-state" role="status" style={{ margin: '200px auto', maxWidth: '420px' }}>
        <span className="async-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    )
  }

  if (!isOrganizer) {
    return (
      <OrganizerLogin
        onSignedIn={refresh}
        signedInAs={user ? user.full_name : ''}
        onSignOut={signOut}
      />
    )
  }
  return <Dashboard onSignOut={signOut} />
}

function OrganizerLogin({ onSignedIn, signedInAs, onSignOut }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const data = await volunteerLogin(username, password)
      storeTokens({ access: data.access, refresh: data.refresh, username })
      const me = await onSignedIn()
      if (me && !me.is_organizer) {
        setError('That account does not have organizer access.')
      }
    } catch (err) {
      setError(err.status === 401 ? 'Wrong username or password.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section checkin-shell">
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Organizers</div>
        <h1 className="h-md" style={{ textAlign: 'center', marginBottom: '28px' }}>
          Sign in
        </h1>
        {signedInAs && (
          <p className="form-note" style={{ textAlign: 'center', marginBottom: '20px' }}>
            You're signed in as <strong>{signedInAs}</strong>, which doesn't have
            organizer access.{' '}
            <button type="button" className="link-button" onClick={onSignOut}>
              Sign out
            </button>{' '}
            and use an organizer account.
          </p>
        )}
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="org-user">Username</label>
            <input
              id="org-user" autoComplete="username" autoCapitalize="none"
              value={username} onChange={(e) => setUsername(e.target.value)}
              disabled={busy} required
            />
          </div>
          <div className="field">
            <label htmlFor="org-pass">Password</label>
            <input
              id="org-pass" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={busy} required
            />
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  )
}

function Dashboard({ onSignOut }) {
  const [data, setData] = useState(null)
  const [series, setSeries] = useState([])
  const [events, setEvents] = useState([])
  // Empty means "let the server pick" — it defaults to the soonest upcoming
  // event, which is the one an organizer means on event day.
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportNote, setExportNote] = useState('')

  const load = useCallback(async (slug, { quiet = false } = {}) => {
    if (!quiet) setLoading(true)
    try {
      const [stats, analytics] = await Promise.all([
        fetchDashboard(slug),
        fetchAnalytics(slug, 14),
      ])
      setData(stats)
      setSeries(analytics.registrations_per_day ?? [])
      setError(null)
    } catch (err) {
      // A failed background poll must not wipe numbers already on screen —
      // an organizer glancing at this mid-event should see the last good state.
      if (!quiet) setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(selected)
    const timer = setInterval(() => load(selected, { quiet: true }), POLL_MS)
    return () => clearInterval(timer)
  }, [load, selected])

  // The picker only needs the list once.
  useEffect(() => {
    fetchEvents({ page_size: 100 })
      .then(setEvents)
      .catch(() => setEvents([]))
  }, [])

  const exportCsv = async () => {
    setExporting(true)
    setExportNote('')
    try {
      const filename = await downloadAttendeeCsv(data?.event?.slug)
      setExportNote(`Downloaded ${filename}`)
    } catch (err) {
      setExportNote(err.message)
    } finally {
      setExporting(false)
    }
  }

  const signOut = () => {
    // AuthContext.signOut clears the tokens and resets the cached user.
    onSignOut()
  }

  const event = data?.event
  const capacity = data?.capacity
  const door = data?.door
  const money = data?.money
  const regs = data?.registrations

  return (
    <section className="section checkin-shell">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="checkin-bar">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Organizer</div>
            <span className="checkin-user">{getVolunteerName() || 'Signed in'}</span>
          </div>
          <div className="checkin-status">
            {events.length > 1 && (
              <select
                className="dash-picker"
                aria-label="Event"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Next event</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.slug}>{ev.title}</option>
                ))}
              </select>
            )}
            <button type="button" className="link-underline" onClick={() => load(selected)}>
              Refresh
            </button>
            <button type="button" className="link-underline" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>

        <AsyncBoundary
          loading={loading && !data}
          error={!data ? error : null}
          isEmpty={Boolean(data && !event)}
          emptyMessage="No events exist yet."
          onRetry={() => load(selected)}
        >
          {data && event && (
            <>
              <div className="dash-head">
                <div>
                  <h1 className="h-md" style={{ margin: 0 }}>{event.title}</h1>
                  <p className="text-muted" style={{ marginTop: '6px', fontSize: '13.5px' }}>
                    {formatDate(event.start_datetime)}
                    {' · '}
                    {event.registration_is_open
                      ? 'Registration open'
                      : event.closed_reason || 'Registration closed'}
                  </p>
                </div>
                <span className="dash-live">Updates every {POLL_MS / 1000}s</span>
              </div>

              <div className="dash-grid">
                <Stat
                  label="Checked in"
                  value={door.checked_in}
                  sub={`of ${door.tickets_issued} issued · ${door.attendance_rate}%`}
                  accent
                />
                <Stat label="Yet to arrive" value={door.yet_to_arrive} sub="tickets not scanned" />
                <Stat
                  label="Seats taken"
                  value={capacity.seats_taken}
                  sub={
                    capacity.capacity
                      ? `of ${capacity.capacity} · ${capacity.percent_sold}%`
                      : 'unlimited capacity'
                  }
                />
                <Stat
                  label="Collected"
                  value={`${money.currency} ${money.collected}`}
                  sub={
                    Number(money.outstanding) > 0
                      ? `${money.currency} ${money.outstanding} outstanding`
                      : 'nothing outstanding'
                  }
                />
              </div>

              {capacity.capacity && (
                <div className="dash-bar" aria-hidden="true">
                  <div
                    className="dash-bar-fill"
                    style={{ width: `${Math.min(100, capacity.percent_sold ?? 0)}%` }}
                  />
                </div>
              )}

              <div className="dash-columns">
                <div>
                  <h2 className="dash-title">Registrations</h2>
                  <ul className="dash-list">
                    <li><span>Confirmed</span><strong>{regs.confirmed}</strong></li>
                    <li><span>Awaiting payment</span><strong>{regs.pending}</strong></li>
                    <li><span>Cancelled</span><strong>{regs.cancelled}</strong></li>
                    <li><span>Expired holds</span><strong>{regs.expired}</strong></li>
                    <li className="dash-total"><span>Total</span><strong>{regs.total}</strong></li>
                  </ul>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={exportCsv}
                    disabled={exporting}
                    style={{ marginTop: '18px' }}
                  >
                    {exporting ? 'Preparing…' : 'Export attendee list (CSV)'}
                  </button>
                  {exportNote && <p className="form-note">{exportNote}</p>}
                  <p className="form-note">
                    Contains attendee names, emails and phone numbers. Handle it accordingly.
                  </p>
                </div>

                <div>
                  <h2 className="dash-title">Last 14 days</h2>
                  <Sparkline series={series} />
                  <h2 className="dash-title" style={{ marginTop: '26px' }}>Recent arrivals</h2>
                  {data.recent_check_ins.length === 0 ? (
                    <p className="form-note">Nobody has been scanned in yet.</p>
                  ) : (
                    <ul className="dash-arrivals">
                      {data.recent_check_ins.map((row) => (
                        <li key={row.id}>
                          <strong>{row.attendee_name || row.ticket_number}</strong>
                          <span>{row.volunteer_username || 'unknown'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </AsyncBoundary>
      </div>
    </section>
  )
}

function Stat({ label, value, sub, accent }) {
  return (
    <div className={`dash-stat${accent ? ' dash-stat-accent' : ''}`}>
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-value">{value}</div>
      {sub && <div className="dash-stat-sub">{sub}</div>}
    </div>
  )
}

/**
 * Bar chart of daily registrations.
 *
 * Deliberately hand-rolled rather than pulling in a charting library: it is one
 * series of fourteen bars, and a chart dependency would outweigh the whole
 * dashboard.
 */
function Sparkline({ series }) {
  if (!series.length) return <p className="form-note">No registrations yet.</p>

  const peak = Math.max(...series.map((d) => d.count), 1)

  return (
    <div className="sparkline" role="img" aria-label={`Registrations per day, peak ${peak}`}>
      {series.map((day) => (
        <div key={day.date} className="sparkline-col" title={`${day.date}: ${day.count}`}>
          <div
            className="sparkline-bar"
            style={{ height: `${Math.max(3, (day.count / peak) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  )
}
