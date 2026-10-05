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

const videoType = (src) => (src.startsWith('data:video/webm') || src.endsWith('.webm') ? 'video/webm' : 'video/mp4')

function Clip({ srcs, label, className }) {
  return (
    <video className={className} autoPlay muted loop playsInline aria-label={label}>
      {srcs.map((src) => <source key={src} src={src} type={videoType(src)} />)}
    </video>
  )
}

function ItemNote({ item, onClose }) {
  // several photos/videos get a wider note and an even grid of tiles
  const media = (item.photos?.length ?? 0) + (item.videos?.length ?? 0)
  const grid = media > 1
  const cls = item.hero ? 'note' : item.concerts || item.memories || item.scatter || item.story?.some(b => b.row) ? 'note gallery wide' : grid ? 'note gallery' : 'note'
  return (
    <Sheet onClose={onClose} className={cls} labelledBy="note-title">
      <p className="eyebrow">{SECTIONS[item.section]}</p>
      <h2 id="note-title">{item.title}</h2>
      {item.book ? (
        <figure className="book">
          <img src={item.book.cover} alt={`${item.book.title} cover`} />
          <figcaption><b>{item.book.title}</b><br />{item.book.author}</figcaption>
        </figure>
      ) : item.body.length ? item.body.map((p, i) => <p key={i}>{p}</p>) : !item.story && <Empty />}
      {item.photos && (
        <div className={grid ? 'tiles' : 'snaps'}>
          {item.photos.map((src, j) => <img key={j} className={grid ? 'tile' : 'snap tall'} src={src} alt={`${item.title} photo`} />)}
          {item.videos?.map((srcs, j) => (
            <Clip key={`v${j}`} srcs={srcs} className={grid ? 'tile' : 'snap tall'} label={`${item.title} video`} />
          ))}
        </div>
      )}
      {item.hero && <img className={item.heroBig ? 'hero big' : 'hero'} src={item.hero} alt={item.title} />}
      {item.story?.map((b, j) => {
        if (b.row) {
          return (
            <div key={j} className={`photo-row${b.narrow ? ' narrow' : ''}`}>
              {b.row.map((src, k) => <img key={k} src={src} alt={`${item.title} photo`} />)}
            </div>
          )
        }
        if (!b.link) return <p key={j}>{b.p}</p>
        const [before, after] = b.p.split(b.link.text)
        return <p key={j}>{before}<a className="cta inline" href={b.link.href} target="_blank" rel="noreferrer">{b.link.text}</a>{after}</p>
      })}
      {item.scatter && (
        <div className={`scatter ${item.scatterKind || ''}`}>
          {item.scatter.map((m, j) => (
            <img key={j} src={m.src} alt={`${item.title} photo ${j + 1}`} draggable="false" className={`bit bit${j + 1}${m.cut ? ' cut' : ''}`} />
          ))}
        </div>
      )}
      {item.concerts && (
        <div className="shows">
          {item.concerts.map((c, j) => (
            <figure key={j} className="show">
              {c.video ? <Clip srcs={c.video} className="tile" label={`${c.name} video`} /> : <img className="tile" src={c.photo} alt={`${c.name} concert`} />}
              <figcaption><b>{c.name}</b><br />{c.date}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {item.memories && (
        <div className="memories">
          {item.memories.map((m, j) => (
            <figure key={j} className="memory">
              {m.video ? <Clip srcs={m.video} label={m.text} /> : <img src={m.photo} alt={m.text} />}
              <figcaption>{m.text}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {item.article && (
        <div className="article">
          <img src={item.article.src} alt="The Daily Californian article about Lorde at the Greek Theatre" />
          <p>{item.article.text}</p>
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

// A pile of photos; clicking sends the top one to the back.
const TILTS = [-3, 4, -6, 2, 6, -2]

function PhotoStack({ photos }) {
  const [top, setTop] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const next = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => { setTop((t) => (t + 1) % photos.length); setLeaving(false) }, 320)
  }
  return (
    <figure className="stack-wrap">
      <button className="stack" onClick={next} aria-label={`Photo ${top + 1} of ${photos.length}, click for the next one`}>
        {photos.map((src, i) => {
          const depth = (i - top + photos.length) % photos.length
          const out = depth === 0 && leaving
          return (
            <img
              key={i}
              src={src}
              alt=""
              draggable="false"
              className={out ? 'out' : undefined}
              style={{ zIndex: photos.length - depth, transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
            />
          )
        })}
      </button>
      <figcaption>click through the stack</figcaption>
    </figure>
  )
}

function AboutPage({ onClose }) {
  const [hello, ...rest] = aboutPage.body
  return (
    <Sheet onClose={onClose} className="note page" labelledBy="page-title">
      <h2 id="page-title">{aboutPage.title}</h2>
      {aboutPage.body.length ? <><p className="hello">{hello}</p>{rest.map((p, i) => <p key={i}>{p}</p>)}</> : <Empty />}
      {aboutPage.photos?.length > 0 && <PhotoStack photos={aboutPage.photos} />}
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
                  const img = <img key={j} className="snap" src={src} alt={`${e.org} photo`} />
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

// every image URL inside a note's data (photos, rows, scatter, covers...)
const isImg = (v) => typeof v === 'string' && (v.startsWith('data:image') || /\.(jpe?g|png|webp|gif|avif)$/i.test(v))
function imagesIn(v, out = new Set()) {
  if (isImg(v)) out.add(v)
  else if (Array.isArray(v)) v.forEach((x) => imagesIn(x, out))
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => k !== 'src' || !v.x ? imagesIn(x, out) : null)
  return out
}
const noteData = (what) => (what === 'about' ? aboutPage : what === 'experiences' ? experiences : what)

// load + decode once; later calls reuse the same promise
const ready = new Map()
function preload(src) {
  if (!ready.has(src)) {
    const img = new Image()
    img.src = src
    ready.set(src, img.decode().catch(() => {}))
  }
  return ready.get(src)
}

export default function App() {
  const [open, setOpen] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const lastFocus = useRef(null)
  const pending = useRef(null)

  // quietly warm every note's images once the room itself has loaded
  useEffect(() => {
    let stop = false
    const all = [...imagesIn([items, aboutPage, experiences])]
    const run = async () => { for (const src of all) { if (stop) return; await preload(src) } }
    const start = () => (window.requestIdleCallback ?? setTimeout)(run)
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => { stop = true; window.removeEventListener('load', start) }
  }, [])

  // open is an object from the room, or 'about' / 'experiences' for the header pages.
  // The note waits for its images (up to 2.5s) so it drops in already filled.
  const show = async (what, el) => {
    lastFocus.current = el
    pending.current = what
    setWaiting(true)
    const imgs = [...imagesIn(noteData(what))].map(preload)
    await Promise.race([Promise.all(imgs), new Promise((r) => setTimeout(r, 2500))])
    if (pending.current !== what) return
    setWaiting(false)
    setOpen(what)
  }
  const hide = () => { setOpen(null); lastFocus.current?.focus() }

  return (
    <main className={waiting ? 'waiting' : undefined}>
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
          const style = { left: `${it.x}%`, top: `${it.y}%`, width: `${it.w}%`, zIndex: it.z ?? z }
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
