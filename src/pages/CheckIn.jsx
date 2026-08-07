import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import {
  checkInTicket,
  fetchCheckInHistory,
  volunteerLogin,
} from '../api/services'
import { clearTokens, getVolunteerName, isSignedIn, storeTokens } from '../api/auth'

const QUEUE_KEY = 'tedxumt.scanner.queue'
const SCANNER_ID = 'qr-scanner-region'

/**
 * Volunteer check-in portal.
 *
 * Reached two ways: a volunteer opens /checkin and scans, or a phone camera
 * opens the QR's own URL /checkin/<token> directly. Either way the check-in
 * itself is an authenticated POST — landing on this page never admits anyone,
 * so an attendee scanning their own ticket just sees a login screen.
 *
 * Two PRD edge cases are handled here rather than assumed away:
 * camera permission denied (there is a manual entry box), and the volunteer
 * losing internet (scans queue in localStorage and retry).
 */
export default function CheckIn() {
  const { token: tokenFromUrl } = useParams()
  const [signedIn, setSignedIn] = useState(isSignedIn())

  if (!signedIn) {
    return <VolunteerLogin onSignedIn={() => setSignedIn(true)} />
  }
  return <Scanner initialToken={tokenFromUrl} onSignOut={() => setSignedIn(false)} />
}

function VolunteerLogin({ onSignedIn }) {
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
      onSignedIn()
    } catch (err) {
      setError(err.status === 401 ? 'Wrong username or password.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section checkin-shell">
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Check-in Portal</div>
        <h1 className="h-md" style={{ textAlign: 'center', marginBottom: '28px' }}>
          Volunteer sign in
        </h1>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="vol-user">Username</label>
            <input
              id="vol-user" autoComplete="username" autoCapitalize="none"
              value={username} onChange={(e) => setUsername(e.target.value)}
              disabled={busy} required
            />
          </div>
          <div className="field">
            <label htmlFor="vol-pass">Password</label>
            <input
              id="vol-pass" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={busy} required
            />
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="form-note" style={{ textAlign: 'center' }}>
          Ask an organizer for volunteer access.
        </p>
      </div>
    </section>
  )
}

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeQueue(items) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items))
  } catch {
    /* storage full or unavailable — the queue is a convenience, not a promise */
  }
}

function Scanner({ initialToken, onSignOut }) {
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState('')
  const [cameraError, setCameraError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [queued, setQueued] = useState(() => readQueue().length)
  const [history, setHistory] = useState([])
  const [online, setOnline] = useState(navigator.onLine)

  const scannerRef = useRef(null)
  // Guards against the camera firing the same code dozens of times a second.
  const lastScanRef = useRef({ token: '', at: 0 })

  const submitToken = useCallback(async (token) => {
    if (!token || busy) return
    setBusy(true)
    try {
      const data = await checkInTicket(token)
      setResult(data)
      if (navigator.vibrate) navigator.vibrate(data.allowed ? 60 : [40, 60, 40])
    } catch (err) {
      if (err.isNetwork) {
        // Offline: keep the scan so it can be replayed when the signal returns.
        const queue = [...readQueue(), { token, at: Date.now() }]
        writeQueue(queue)
        setQueued(queue.length)
        setResult({
          result: 'queued',
          allowed: false,
          message: 'No connection — scan saved and will retry automatically.',
        })
      } else {
        setResult({ result: 'error', allowed: false, message: err.message })
      }
    } finally {
      setBusy(false)
    }
  }, [busy])

  // Deep link from a scanned QR: /checkin/<token>.
  // Guarded by a ref so StrictMode's double-mount (and any re-render) submits
  // the token once — a second submit would come back "already checked in" and
  // wrongly tell the volunteer to turn the attendee away.
  const deepLinkSubmitted = useRef('')
  useEffect(() => {
    if (initialToken && deepLinkSubmitted.current !== initialToken) {
      deepLinkSubmitted.current = initialToken
      submitToken(initialToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken])

  // Replay queued scans whenever the connection comes back.
  const flushQueue = useCallback(async () => {
    const queue = readQueue()
    if (!queue.length || !navigator.onLine) return

    const remaining = []
    for (const item of queue) {
      try {
        await checkInTicket(item.token)
      } catch (err) {
        if (err.isNetwork) remaining.push(item)
        // A rejected ticket (duplicate/invalid) is a resolved outcome, not a
        // retry candidate — dropping it stops the queue growing forever.
      }
    }
    writeQueue(remaining)
    setQueued(remaining.length)
  }, [])

  useEffect(() => {
    const goOnline = () => {
      setOnline(true)
      flushQueue()
    }
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    flushQueue()
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [flushQueue])

  // Camera lifecycle.
  useEffect(() => {
    let cancelled = false
    let scanner
    try {
      scanner = new Html5Qrcode(SCANNER_ID, { verbose: false })
    } catch {
      setCameraError('Could not start the camera. Use manual entry below.')
      return undefined
    }
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          const now = Date.now()
          const { token, at } = lastScanRef.current
          // Ignore repeats of the same code within 3s — the camera decodes
          // continuously and would otherwise fire a burst of requests.
          if (decoded === token && now - at < 3000) return
          lastScanRef.current = { token: decoded, at: now }
          submitToken(decoded)
        },
        () => {
          /* per-frame decode misses are normal; ignore */
        },
      )
      .then(() => {
        if (!cancelled) setScanning(true)
      })
      .catch((err) => {
        if (!cancelled) {
          setCameraError(
            String(err?.message || err).toLowerCase().includes('permission')
              ? 'Camera permission denied. Use manual entry below, or allow camera access and reload.'
              : 'No camera available. Use manual entry below.',
          )
        }
      })

    return () => {
      cancelled = true
      const active = scannerRef.current
      if (!active) return

      // html5-qrcode throws *synchronously* from stop() when the scanner is not
      // running, so a bare .catch() never sees it and the error escapes and
      // unmounts the whole tree. That happens on every StrictMode double-mount
      // and whenever the camera was denied — both entirely normal. Check the
      // state first and wrap the call regardless.
      try {
        const state = active.getState?.()
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          active.stop().then(() => active.clear()).catch(() => {})
        } else {
          active.clear?.()
        }
      } catch {
        /* the camera was never running — nothing to tear down */
      }
    }
  }, [submitToken])

  const loadHistory = async () => {
    try {
      setHistory(await fetchCheckInHistory())
    } catch {
      setHistory([])
    }
  }

  const signOut = () => {
    clearTokens()
    onSignOut()
  }

  return (
    <section className="section checkin-shell">
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="checkin-bar">
          <div>
            <div className="eyebrow" style={{ margin: 0 }}>Check-in</div>
            <span className="checkin-user">{getVolunteerName() || 'Volunteer'}</span>
          </div>
          <div className="checkin-status">
            {!online && <span className="chip chip-warn">Offline</span>}
            {queued > 0 && <span className="chip chip-warn">{queued} queued</span>}
            <button type="button" className="link-underline" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>

        <div className={`scan-frame${scanning ? ' live' : ''}`}>
          <div id={SCANNER_ID} />
          {!scanning && !cameraError && <p className="scan-hint">Starting camera…</p>}
        </div>

        {cameraError && (
          <div className="async-state async-state-error" role="alert">
            <p>{cameraError}</p>
          </div>
        )}

        {result && <ScanResult result={result} onDismiss={() => setResult(null)} />}

        <form
          className="manual-entry"
          onSubmit={(e) => {
            e.preventDefault()
            submitToken(manual.trim())
            setManual('')
          }}
        >
          <label htmlFor="manual-token">Manual entry</label>
          <div className="manual-row">
            <input
              id="manual-token"
              placeholder="Paste ticket code or link"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              disabled={busy}
            />
            <button type="submit" className="btn btn-secondary" disabled={busy || !manual.trim()}>
              Check
            </button>
          </div>
        </form>

        <details className="checkin-history" onToggle={(e) => e.target.open && loadHistory()}>
          <summary>Recent scans</summary>
          {history.length === 0 ? (
            <p className="form-note">Nothing scanned yet on this account.</p>
          ) : (
            <ul>
              {history.map((row) => (
                <li key={row.id}>
                  <span className={`chip chip-${row.result === 'allowed' ? 'ok' : 'warn'}`}>
                    {row.result}
                  </span>
                  <span>{row.attendee_name || row.ticket_number || 'Unknown code'}</span>
                </li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </section>
  )
}

function ScanResult({ result, onDismiss }) {
  const tone = result.allowed ? 'ok' : result.result === 'queued' ? 'warn' : 'bad'

  return (
    <div className={`scan-result scan-${tone}`} role="alert">
      <div className="scan-verdict">
        {result.allowed ? '✓ Allow entry' : result.result === 'queued' ? '… Saved' : '✕ Refused'}
      </div>
      <p className="scan-message">{result.message}</p>
      {result.attendee_name && (
        <div className="scan-attendee">
          <strong>{result.attendee_name}</strong>
          {result.cnic_last4 && <span>CNIC ••••{result.cnic_last4}</span>}
          {result.ticket_number && <span>{result.ticket_number}</span>}
        </div>
      )}
      <button type="button" className="btn btn-secondary btn-sm" onClick={onDismiss}>
        Next attendee
      </button>
    </div>
  )
}
