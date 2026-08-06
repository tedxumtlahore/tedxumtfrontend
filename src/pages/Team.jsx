import { useReveal } from '../hooks/useReveal'
import { useApi } from '../hooks/useApi'
import { fetchTeam } from '../api/services'
import PageHero from '../components/common/PageHero'
import TeamCard from '../components/common/TeamCard'
import AsyncBoundary from '../components/common/AsyncBoundary'

export default function Team() {
  const { data, loading, error, refetch } = useApi(fetchTeam, [], { initialData: [] })

  // Departments with nobody in them would render as a bare heading.
  const departments = (data ?? []).filter((d) => (d.members ?? []).length > 0)
  const ref = useReveal([departments.length])

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Our Team"
        title="The people behind the stage"
        desc="TEDxUMT Lahore is entirely student-run — organized by committees who spend a full year building one afternoon of ideas."
      />

      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={departments.length === 0}
        emptyMessage="Our team page is being updated — check back shortly."
        onRetry={refetch}
      >
        {departments.map((dept, i) => (
          <section
            key={dept.id}
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
                {dept.name}
              </h2>
              {dept.description && (
                <p className="text-lead reveal" style={{ marginBottom: '28px' }}>
                  {dept.description}
                </p>
              )}
              <div className="grid grid-4">
                {dept.members.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </AsyncBoundary>
    </div>
  )
}
