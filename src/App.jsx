import ArchiveSearch from './components/ArchiveSearch'

export default function App() {
  return (
    <main className="page-shell">
      <header className="brand-block">
        <p className="brand-primary">Spoken Archive Engine</p>
        <h1 className="brand-secondary">Down to Brass Tacks</h1>
        <p className="brand-note">
          Editorial prototype for spoken-record discovery. Frontend-only interface using
          mock archival materials.
        </p>
      </header>

      <ArchiveSearch />
    </main>
  )
}
