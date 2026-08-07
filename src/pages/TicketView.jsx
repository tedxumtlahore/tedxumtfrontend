import { Link, useParams } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchTicket, ticketPdfUrl, ticketQrUrl } from '../api/services'
import { formatDate, formatTime } from '../utils/format'
import AsyncBoundary from '../components/common/AsyncBoundary'
import NotFound from './NotFound'

/**
 * The attendee's ticket, reached by the unguessable access token in their
 * email. This page is the ticket — it is what they hold up at the door — so it
 * shows the QR large and offers the PDF for printing or offline use.
 */
export default function TicketView() {
  const { accessToken } = useParams()
  const { data: ticket, loading, error, refetch } = useApi(
    () => fetchTicket(accessToken), [accessToken],
  )
  const ref = useReveal([ticket])

  if (error?.status === 404) return <NotFound type="Ticket" />

  if (loading || error || !ticket) {
    return (
      <div style={{ paddingTop: '170px', minHeight: '60vh' }}>
        <div className="container">
          <AsyncBoundary loading={loading} error={error} onRetry={refetch}>
            <div />
          </AsyncBoundary>
        </div>
      </div>
    )
  }

  const venue = [ticket.venue_name, ticket.venue_address].filter(Boolean).join(', ')

  return (
    <div ref={ref}>
      <section className="section" style={{ paddingTop: '150px' }}>
        <div className="container" style={{ maxWidth: '620px' }}>
          <div className="eyebrow reveal in" style={{ justifyContent: 'center' }}>
            Your Ticket
          </div>

          <div className="ticket-card reveal in reveal-delay-1">
            <div className="ticket-card-head">
              <div>
                <div className="ticket-brand">
                  TED<span className="x">x</span>UMT Lahore
                </div>
                <div className="ticket-admit">ADMIT ONE</div>
              </div>
              <div className="ticket-number">{ticket.ticket_number}</div>
            </div>

            <div className="ticket-card-body">
              <h1 className="ticket-event">{ticket.event_title}</h1>

              <div className="ticket-rows">
                <div>
                  <span className="ticket-label">ATTENDEE</span>
                  <span className="ticket-value">{ticket.attendee_name}</span>
                </div>
                {ticket.event_start && (
                  <div>
                    <span className="ticket-label">WHEN</span>
                    <span className="ticket-value">
                      {formatDate(ticket.event_start)} · {formatTime(
                        new Date(ticket.event_start).toTimeString().slice(0, 8),
                      )}
                    </span>
                  </div>
                )}
                {venue && (
                  <div>
                    <span className="ticket-label">WHERE</span>
                    <span className="ticket-value">{venue}</span>
                  </div>
                )}
              </div>

              {ticket.checked_in ? (
                <div className="ticket-used" role="status">
                  <strong>Already checked in</strong>
                  <span>
                    Scanned {formatDate(ticket.checked_in_at)} — this ticket cannot be used again.
                  </span>
                </div>
              ) : (
                <div className="ticket-qr">
                  <img
                    src={ticketQrUrl(accessToken)}
                    alt={`QR code for ticket ${ticket.ticket_number}`}
                    width="220"
                    height="220"
                  />
                  <p>Show this at the entrance</p>
                </div>
              )}
            </div>

            <div className="ticket-card-foot">
              Admits one person and is scanned once — please don&apos;t share it. Bring photo ID.
            </div>
          </div>

          <div className="ticket-actions reveal reveal-delay-2">
            <a
              className="btn btn-primary"
              href={ticketPdfUrl(accessToken)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
            <Link className="btn btn-secondary" to={`/events/${ticket.event_slug}`}>
              Event details
            </Link>
          </div>

          <p className="form-note reveal" style={{ textAlign: 'center' }}>
            Bookmark this page — it is your ticket. We also emailed you a copy.
          </p>
        </div>
      </section>
    </div>
  )
}
