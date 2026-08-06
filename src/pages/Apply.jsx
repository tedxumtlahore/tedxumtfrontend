import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import {
  fetchApplicationOptions,
  submitPartnerApplication,
  submitSpeakerApplication,
  submitVolunteerApplication,
} from '../api/services'
import { icon } from '../utils/format'
import PageHero from '../components/common/PageHero'

/**
 * The Apply page used to be three cards that all pointed at /contact.
 * Each track now posts to its own endpoint, so applications land in the right
 * admin inbox instead of the generic contact one.
 */
const TRACKS = {
  speaker: {
    icon: 'speaker',
    title: 'Become a Speaker',
    blurb: "Pitch us the idea you can't stop thinking about.",
    submit: submitSpeakerApplication,
    empty: {
      full_name: '', email: '', phone: '', organization: '', designation: '',
      talk_title: '', talk_summary: '', previous_experience: '', linkedin: '', video_url: '',
    },
    fields: [
      ['full_name', 'Full Name', 'input', { required: true }],
      ['email', 'Email Address', 'input', { type: 'email', required: true }],
      ['phone', 'Phone (optional)', 'input', {}],
      ['organization', 'Organization (optional)', 'input', {}],
      ['designation', 'Role / Title (optional)', 'input', {}],
      ['talk_title', 'Working Talk Title', 'input', { required: true }],
      ['talk_summary', 'What is the idea worth spreading?', 'textarea', { required: true, rows: 5 }],
      ['previous_experience', 'Previous speaking experience (optional)', 'textarea', { rows: 3 }],
      ['linkedin', 'LinkedIn (optional)', 'input', { type: 'url' }],
      ['video_url', 'Link to a previous talk (optional)', 'input', { type: 'url' }],
    ],
  },
  volunteer: {
    icon: 'volunteer',
    title: 'Volunteer / Join the Team',
    blurb: 'Join the crew that makes event day run without a hitch.',
    submit: submitVolunteerApplication,
    empty: {
      full_name: '', email: '', phone: '', university: '', student_id: '',
      preferred_department: '', availability: 'event_day', skills: '', motivation: '',
    },
    fields: [
      ['full_name', 'Full Name', 'input', { required: true }],
      ['email', 'Email Address', 'input', { type: 'email', required: true }],
      ['phone', 'Phone (optional)', 'input', {}],
      ['university', 'University (optional)', 'input', {}],
      ['student_id', 'Student ID (optional)', 'input', {}],
      ['preferred_department', 'Preferred department (optional)', 'input', {}],
      ['availability', 'Availability', 'select', { optionsKey: 'availability' }],
      ['skills', 'Skills you bring (optional)', 'textarea', { rows: 3 }],
      ['motivation', 'Why do you want to join?', 'textarea', { required: true, rows: 4 }],
    ],
  },
  partner: {
    icon: 'partner',
    title: 'Partner or Sponsor',
    blurb: "Put your brand in front of Lahore's most curious minds.",
    submit: submitPartnerApplication,
    empty: {
      organization_name: '', contact_person: '', email: '', phone: '', website: '',
      partnership_type: 'sponsor', proposal: '',
    },
    fields: [
      ['organization_name', 'Organization Name', 'input', { required: true }],
      ['contact_person', 'Contact Person', 'input', { required: true }],
      ['email', 'Email Address', 'input', { type: 'email', required: true }],
      ['phone', 'Phone (optional)', 'input', {}],
      ['website', 'Website (optional)', 'input', { type: 'url' }],
      ['partnership_type', 'Partnership Type', 'select', { optionsKey: 'partnershipTypes' }],
      ['proposal', 'What do you have in mind?', 'textarea', { required: true, rows: 5 }],
    ],
  },
}

const TRACK_KEYS = Object.keys(TRACKS)

export default function Apply() {
  const [active, setActive] = useState(null)
  const options = useApi(fetchApplicationOptions, [], {
    initialData: { availability: [], partnershipTypes: [] },
  })
  const ref = useReveal([active])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Apply"
        title="However you want in, there's a seat here"
        desc="Speak, volunteer, sponsor, or join the team that builds it all."
      />

      <section className="section">
        <div className="container grid grid-3">
          {TRACK_KEYS.map((key, i) => {
            const track = TRACKS[key]
            return (
              <div key={key} className={`apply-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="icon-badge">{icon(track.icon)}</div>
                <h3>{track.title}</h3>
                <p style={{ margin: '10px 0 22px' }}>{track.blurb}</p>
                <button
                  type="button"
                  className="link-underline"
                  onClick={() => setActive(active === key ? null : key)}
                  aria-expanded={active === key}
                >
                  {active === key ? 'Close form' : 'Apply Now →'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {active && (
        <section
          className="section"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        >
          <div className="container" style={{ maxWidth: '760px' }}>
            <div className="eyebrow reveal in">Application</div>
            <h2 className="h-lg reveal in" style={{ marginBottom: '28px' }}>
              {TRACKS[active].title}
            </h2>
            <ApplicationForm
              key={active}
              track={TRACKS[active]}
              options={options.data}
              onDone={() => setActive(null)}
            />
          </div>
        </section>
      )}
    </div>
  )
}

function ApplicationForm({ track, options, onDone }) {
  const { showToast } = useToast()
  const [values, setValues] = useState(track.empty)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setErrors({})
    try {
      const result = await track.submit(values)
      showToast(result?.message || 'Application received.')
      setValues(track.empty)
      onDone?.()
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      showToast(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="reveal in reveal-delay-1" onSubmit={handleSubmit} noValidate>
      {track.fields.map(([name, label, kind, config]) => {
        const id = `apply-${name}`
        const error = errors[name]
        const shared = {
          id,
          name,
          value: values[name] ?? '',
          onChange: setField(name),
          disabled: submitting,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? `${id}-error` : undefined,
        }

        return (
          <div className="field" key={name}>
            <label htmlFor={id}>{label}</label>
            {kind === 'select' ? (
              <select {...shared}>
                {(options?.[config.optionsKey] ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : kind === 'textarea' ? (
              <textarea rows={config.rows ?? 4} {...shared} />
            ) : (
              <input type={config.type ?? 'text'} {...shared} />
            )}
            {error && (
              <p className="field-error" id={`${id}-error`} role="alert">
                {error}
              </p>
            )}
          </div>
        )
      })}
      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
