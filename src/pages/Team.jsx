import { useReveal } from '../hooks/useReveal'
import { TEAM } from '../data/siteData'
import PageHero from '../components/common/PageHero'
import TeamCard from '../components/common/TeamCard'

export default function Team() {
  const ref = useReveal()

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Our Team"
        title="The people behind the stage"
        desc="TEDxUMT Lahore is entirely student-run — organized by committees who spend a full year building one afternoon of ideas."
      />

      {Object.entries(TEAM).map(([dept, members], i) => (
        <section
          key={dept}
          className="section"
          style={
            i % 2
              ? {
                  background: 'var(--bg-secondary)',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                }
              : undefined
          }
        >
          <div className="container">
            <h2 className="h-md reveal" style={{ marginBottom: '28px' }}>
              {dept}
            </h2>
            <div className="grid grid-4">
              {members.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
