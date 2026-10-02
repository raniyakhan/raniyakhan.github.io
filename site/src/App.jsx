import { useEffect, useRef, useState } from 'react'
import { items, SECTIONS, ROOM_ASPECT, aboutPage, experiences } from './room.js'

function Sheet({ onClose, className = 'note', labelledBy, children }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="veil" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={className} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button ref={closeRef} className="close" onClick={onClose} aria-label="Close">close ×</button>
        {children}
      </div>
    </div>
  )
}

const Empty = () => <p className="placeholder">nothing written here yet.</p>

function ItemNote({ item, onClose }) {
  return (
    <Sheet onClose={onClose} labelledBy="note-title">
      <p className="eyebrow">{SECTIONS[item.section]}</p>
      <h2 id="note-title">{item.title}</h2>
      {item.book ? (
        <figure className="book">
          <img src={item.book.cover} alt={`${item.book.title} cover`} />
          <figcaption><b>{item.book.title}</b><br />{item.book.author}</figcaption>
        </figure>
      ) : item.body.length ? item.body.map((p, i) => <p key={i}>{p}</p>) : <Empty />}
      {item.photos && (
        <div className="snaps">
          {item.photos.map((src, j) => <img key={j} className="snap tall" src={src} alt={`${item.title} photo`} loading="lazy" />)}
          {item.videos?.map((src, j) => <video key={`v${j}`} className="snap tall" src={src} autoPlay muted loop playsInline aria-label={`${item.title} video`} />)}
        </div>
      )}
      {item.link && (
        <p><a className="cta" href={item.link.href} target="_blank" rel="noreferrer">{item.link.label}</a></p>
      )}
      {item.links && (
        <ul className="links">
          {item.links.map((l) => (
            <li key={l.label}>
              {l.href ? <a className="cta" href={l.href} target="_blank" rel="noreferrer">{l.label}</a> : <span className="soon">{l.label}</span>}
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}

function AboutPage({ onClose }) {
  return (
    <Sheet onClose={onClose} className="note page" labelledBy="page-title">
      <h2 id="page-title">{aboutPage.title}</h2>
      {aboutPage.body.length ? aboutPage.body.map((p, i) => <p key={i}>{p}</p>) : <Empty />}
    </Sheet>
  )
}

function ExperiencesPage({ onClose }) {
  return (
    <Sheet onClose={onClose} className="note page wide" labelledBy="page-title">
      <h2 id="page-title">experiences</h2>
      {experiences.length === 0 && <Empty />}
      <ol className="exp">
        {experiences.map((e, i) => (
          <li key={i}>
            <div className="exp-text">
            <p className="exp-head"><span className="exp-role">{e.role}</span>{e.org && <>, {e.org}</>}</p>
            <p className="exp-meta">{[e.when, e.where].filter(Boolean).join(' · ')}</p>
            <p>{e.line}</p>
            </div>
            {e.photos && (
              <div className="snaps">
                {e.photos.map((src, j) => {
                  const img = <img key={j} className="snap" src={src} alt={`${e.org} photo`} loading="lazy" />
                  return e.link ? <a key={j} href={e.link} target="_blank" rel="noreferrer" className="snap-link">{img}</a> : img
                })}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Sheet>
  )
}

export default function App() {
  const [open, setOpen] = useState(null)
  const lastFocus = useRef(null)

  // open is an object from the room, or 'about' / 'experiences' for the header pages
  const show = (what, el) => { lastFocus.current = el; setOpen(what) }
  const hide = () => { setOpen(null); lastFocus.current?.focus() }

  return (
    <main>
      <header>
        <h1>raniya's room</h1>
        <nav>
          <button className="link" onClick={(e) => show('about', e.currentTarget)}>about me</button>
          <button className="link" onClick={(e) => show('experiences', e.currentTarget)}>experiences</button>
          <span className="hint">or click around!</span>
        </nav>
      </header>

      <div className="room" style={{ aspectRatio: ROOM_ASPECT }}>
        {items.map((it, z) => {
          const style = { left: `${it.x}%`, top: `${it.y}%`, width: `${it.w}%`, zIndex: z }
          if (!it.section) {
            return <img key={it.id} className="thing decor" src={it.src} alt="" style={style} draggable="false" />
          }
          return (
            <button key={it.id} className="thing" style={style} onClick={(e) => show(it.opens ?? it, e.currentTarget)} aria-label={`${it.title} (${SECTIONS[it.section]})`}>
              <img src={it.src} alt="" draggable="false" />
              <span className="cap">{it.title}</span>
            </button>
          )
        })}
      </div>

      <footer>
        {items.find((it) => it.id === 'phone').links.map((l) =>
          l.href ? <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a> : <span key={l.label} className="soon">{l.label}</span>
        )}
      </footer>

      {open === 'about' && <AboutPage onClose={hide} />}
      {open === 'experiences' && <ExperiencesPage onClose={hide} />}
      {open && typeof open === 'object' && <ItemNote item={open} onClose={hide} />}
    </main>
  )
}
