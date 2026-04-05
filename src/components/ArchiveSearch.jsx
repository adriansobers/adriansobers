import { useMemo, useState } from 'react'
import { archiveEntries } from '../mockData'

const defaultQuery = 'public record archive'

export default function ArchiveSearch() {
  const [query, setQuery] = useState(defaultQuery)
  const [sourceLimit, setSourceLimit] = useState(5)

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return archiveEntries
    }

    return archiveEntries.filter((entry) => {
      const haystack = [
        entry.title,
        entry.speaker,
        entry.collection,
        entry.excerpt,
        ...entry.evidence.map(
          (item) => `${item.citation} ${item.note} ${item.episode.title} ${item.episode.date}`
        )
      ]
        .join(' ')
        .toLowerCase()

      return normalized.split(/\s+/).every((token) => haystack.includes(token))
    })
  }, [query])

  const lead = results[0]
  const visibleEvidence = lead ? lead.evidence.slice(0, sourceLimit) : []

  return (
    <section className="archive-panel">
      <header className="panel-header">
        <h2>Structured Search</h2>
        <p>Query spoken records and inspect supporting evidence before citation.</p>
      </header>

      <label className="field-label" htmlFor="archive-query">
        Search transcript and citation fields
      </label>
      <input
        id="archive-query"
        className="query-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g., labor testimony access"
      />

      <div className="results-meta">
        <span>{results.length} matching record(s)</span>
        <span>Mock dataset only</span>
      </div>

      {lead ? (
        <article className="answer-card">
          <h3>Answer</h3>
          <p className="answer-text">{lead.excerpt}</p>
          <p className="answer-attribution">
            {lead.speaker} — {lead.title} ({lead.date})
          </p>

          <div className="evidence-header-row">
            <h4>Evidence</h4>
            <label htmlFor="source-limit" className="sources-control">
              Sources
              <select
                id="source-limit"
                value={sourceLimit}
                onChange={(event) => setSourceLimit(Number(event.target.value))}
              >
                <option value={3}>Show 3</option>
                <option value={5}>Show 5</option>
                <option value={8}>Show 8</option>
              </select>
            </label>
          </div>

          <ul>
            {visibleEvidence.map((item) => (
              <li key={item.citation}>
                <strong>{item.citation}</strong>
                <span>{item.note}</span>
                <span>{item.episode.title}</span>
              </li>
            ))}
          </ul>

          <p className="sources-status">
            Showing {visibleEvidence.length} of {lead.evidence.length} sources
          </p>

          <h4>Archive</h4>
          <dl className="archive-details">
            <div>
              <dt>Platform</dt>
              <dd>{lead.platform}</dd>
            </div>
            <div>
              <dt>Collection</dt>
              <dd>{lead.collection}</dd>
            </div>
            <div>
              <dt>Record ID</dt>
              <dd>{lead.id}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{Math.round(lead.confidence * 100)}%</dd>
            </div>
          </dl>
        </article>
      ) : (
        <article className="answer-card empty">
          <h3>Answer</h3>
          <p>No records match this query in the mock archive.</p>
        </article>
      )}
    </section>
  )
}
