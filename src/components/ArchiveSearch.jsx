import { useMemo, useState } from 'react'
import { mockSearchResponse } from '../mockData'

const formatTimecode = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
}

export default function ArchiveSearch() {
  const [query, setQuery] = useState(mockSearchResponse.query)
  const [sourceLimit, setSourceLimit] = useState(5)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredEvidence = useMemo(() => {
    if (!normalizedQuery) {
      return mockSearchResponse.evidence
    }

    return mockSearchResponse.evidence.filter((item) => {
      const searchable = [
        mockSearchResponse.answer.summary,
        ...mockSearchResponse.answer.themes.map((theme) => theme.label),
        item.quote,
        item.episode.title,
        item.episode.episode_id,
        item.chunk.chunk_id
      ]
        .join(' ')
        .toLowerCase()

      return normalizedQuery.split(/\s+/).every((token) => searchable.includes(token))
    })
  }, [normalizedQuery])

  const visibleEvidence = filteredEvidence.slice(0, sourceLimit)

  return (
    <section className="archive-panel">
      <header className="panel-header">
        <h2>Search the Archive</h2>
        <p>Evidence-backed retrieval across spoken records in the active collection.</p>
      </header>

      <label className="field-label" htmlFor="archive-query">
        Query by topic, phrase, theme, episode title, or internal record ID
      </label>
      <input
        id="archive-query"
        className="query-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="results-meta">
        <span>{filteredEvidence.length} matching source segment(s)</span>
        <span>Mock dataset only</span>
      </div>

      <article className="answer-card results-enter">
        <header className="answer-header">
          <h3>Answer</h3>
          <span className={`support-badge support-${mockSearchResponse.answer.support_level.label}`}>
            {mockSearchResponse.answer.support_level.label}
          </span>
        </header>

        <p className="answer-text">{mockSearchResponse.answer.summary}</p>
        <p className="support-explanation">
          {mockSearchResponse.answer.support_level.explanation}
        </p>

        <ul className="pill-list" aria-label="Themes">
          {mockSearchResponse.answer.themes.map((theme) => (
            <li key={theme.id}>{theme.label}</li>
          ))}
        </ul>

        <div className="evidence-header-row">
          <h4>Supporting Evidence</h4>
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

        <div className="evidence-stack">
          {visibleEvidence.map((item, index) => (
            <article
              key={item.evidence_id}
              className="evidence-row"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="evidence-quote">“{item.quote}”</p>
              <p className="episode-title">{item.episode.title}</p>
              <p className="evidence-meta-line">
                <span>{formatTimecode(item.chunk.start_time_seconds)}–{formatTimecode(item.chunk.end_time_seconds)}</span>
                <span>Chunk {item.chunk.chunk_index}</span>
                <span>Rank {item.rank}</span>
                <a href={`#${item.transcript_location.anchor}`}>Jump to transcript anchor</a>
              </p>
            </article>
          ))}
        </div>

        <p className="sources-status">
          Showing {visibleEvidence.length} of {filteredEvidence.length} evidence entries
        </p>

        <details className="technical-details">
          <summary>Technical Details</summary>
          <dl className="archive-details">
            <div>
              <dt>Platform</dt>
              <dd>Spoken Archive Engine</dd>
            </div>
            <div>
              <dt>Collection</dt>
              <dd>Down to Brass Tacks</dd>
            </div>
            <div>
              <dt>Collection Slug</dt>
              <dd>{mockSearchResponse.collection}</dd>
            </div>
            <div>
              <dt>Years Searched</dt>
              <dd>{mockSearchResponse.meta.years_searched.join(', ')}</dd>
            </div>
            <div>
              <dt>Evidence Returned</dt>
              <dd>{mockSearchResponse.meta.evidence_returned}</dd>
            </div>
            <div>
              <dt>Generated At</dt>
              <dd>{mockSearchResponse.meta.generated_at}</dd>
            </div>
            <div>
              <dt>Episode ID (top evidence)</dt>
              <dd>{visibleEvidence[0]?.episode.episode_id ?? '—'}</dd>
            </div>
            <div>
              <dt>Chunk ID (top evidence)</dt>
              <dd>{visibleEvidence[0]?.chunk.chunk_id ?? '—'}</dd>
            </div>
          </dl>
        </details>
      </article>
    </section>
  )
}
