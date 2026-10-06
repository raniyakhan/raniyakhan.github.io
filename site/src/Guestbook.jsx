import { useEffect, useRef, useState } from 'react'
import { listNotes, addNote, live, LIMITS, PAPERS, PENS, PAD, toPath, cleanDoodle, penColor, paperColor } from './guestbook.js'

// the same note always leans the same way
const lean = (id) => {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0
  return { rotate: (Math.abs(h) % 9) - 4, lift: Math.abs(h >> 3) % 14, pin: Math.abs(h >> 5) % 3 }
}

function Doodle({ strokes, className }) {
  return (
    <svg className={className} viewBox={`0 0 ${PAD.w} ${PAD.h}`} aria-hidden="true">
      {strokes.map((s, i) => <path key={i} d={s.d} stroke={penColor(s.c)} />)}
    </svg>
  )
}

function Pad({ strokes, setStrokes, pen }) {
  const svg = useRef(null)
  const [line, setLine] = useState(null)
  const at = (e) => {
    const r = svg.current.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * PAD.w, y: ((e.clientY - r.top) / r.height) * PAD.h }
  }
  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); setLine([at(e)]) }
  const move = (e) => line && setLine((l) => [...l, at(e)])
  const up = () => {
    if (!line) return
    setStrokes((s) => [...s, { c: pen, d: toPath(line) }])
    setLine(null)
  }
  return (
    <svg ref={svg} className="pad" viewBox={`0 0 ${PAD.w} ${PAD.h}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label="Drawing space for your doodle">
      {strokes.map((s, i) => <path key={i} d={s.d} stroke={s.c} />)}
      {line && <path d={toPath(line)} stroke={pen} />}
    </svg>
  )
}

const WAIT = 60_000
const lastPinned = () => { try { return Number(localStorage.getItem('guestbook-last')) || 0 } catch { return 0 } }

function Composer({ onPinned, onCancel }) {
  const [paper, setPaper] = useState('butter')
  const [pen, setPen] = useState(PENS[0])
  const [strokes, setStrokes] = useState([])
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [trap, setTrap] = useState('') // bots fill every field; people never see this one
  const [state, setState] = useState('idle')
  const empty = !strokes.length && !message.trim()

  const pin = async (e) => {
    e.preventDefault()
    if (empty || state === 'saving') return
    if (trap) return onCancel()
    if (Date.now() - lastPinned() < WAIT) return setState('slow')
    setState('saving')
    try {
      const note = await addNote({ name: name || 'anonymous', message, doodle: strokes, paper })
      try { localStorage.setItem('guestbook-last', String(Date.now())) } catch { /* fine */ }
      onPinned(note)
    } catch {
      setState('error')
    }
  }

  return (
    <form className="composer" onSubmit={pin}>
      <div className="sticky big" style={{ background: PAPERS[paper] }}>
        <Pad strokes={strokes} setStrokes={setStrokes} pen={pen} />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={LIMITS.message} rows={2} placeholder="write something (or just doodle)" aria-label="Your note" />
      </div>
      <div className="tools">
        <div className="tool-row" role="group" aria-label="Pen color">
          {PENS.map((c) => (
            <button key={c} type="button" className={`dot${pen === c ? ' on' : ''}`} style={{ background: c }} onClick={() => setPen(c)} aria-label={`pen ${c}`} aria-pressed={pen === c} />
          ))}
          <button type="button" className="tool" onClick={() => setStrokes((s) => s.slice(0, -1))} disabled={!strokes.length}>undo</button>
          <button type="button" className="tool" onClick={() => setStrokes([])} disabled={!strokes.length}>clear</button>
        </div>
        <div className="tool-row" role="group" aria-label="Paper color">
          {Object.entries(PAPERS).map(([k, c]) => (
            <button key={k} type="button" className={`swatch${paper === k ? ' on' : ''}`} style={{ background: c }} onClick={() => setPaper(k)} aria-label={`${k} paper`} aria-pressed={paper === k} />
          ))}
        </div>
        <label className="from">
          from
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={LIMITS.name} placeholder="your name" />
        </label>
        <input className="trap" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" />
        <div className="tool-row">
          <button type="submit" className="pin-it" disabled={empty || state === 'saving'}>{state === 'saving' ? 'pinning…' : 'pin it to the wall'}</button>
          <button type="button" className="tool" onClick={onCancel}>never mind</button>
        </div>
        {state === 'slow' && <p className="gb-msg">you just left a note! give it a minute before the next one.</p>}
        {state === 'error' && <p className="gb-msg">that didn't pin. try again in a bit?</p>}
      </div>
    </form>
  )
}

function Sticky({ note, fresh }) {
  const { rotate, lift, pin } = lean(note.id)
  const doodle = cleanDoodle(note.doodle)
  return (
    <figure className={`sticky pin${pin}${fresh ? ' fresh' : ''}`} style={{ background: paperColor(note.paper), '--tilt': `${rotate}deg`, marginTop: lift }}>
      {doodle.length > 0 && <Doodle strokes={doodle} className="doodle" />}
      {note.message && <p>{note.message}</p>}
      <figcaption>from {note.name || 'anonymous'}</figcaption>
    </figure>
  )
}

export default function Guestbook() {
  const [notes, setNotes] = useState(null)
  const [failed, setFailed] = useState(false)
  const [writing, setWriting] = useState(false)
  const [fresh, setFresh] = useState(null)

  useEffect(() => { listNotes().then(setNotes, () => setFailed(true)) }, [])

  const pinned = (note) => {
    setNotes((n) => [note, ...(n ?? [])])
    setFresh(note.id)
    setWriting(false)
  }

  return (
    <>
      <p>Leave a note or a doodle and it'll get pinned to my wall. Say hi!</p>
      {!live && <p className="gb-preview">preview mode: these are sample notes, and yours only saves in this browser.</p>}
      {writing
        ? <Composer onPinned={pinned} onCancel={() => setWriting(false)} />
        : <button className="add-note" onClick={() => setWriting(true)}>+ leave a note</button>}
      {failed && <p className="placeholder">the wall didn't load. try again in a bit?</p>}
      {notes && (
        <div className="wall">
          {notes.map((n) => <Sticky key={n.id} note={n} fresh={n.id === fresh} />)}
          {notes.length === 0 && <p className="placeholder">no notes yet. be the first!</p>}
        </div>
      )}
    </>
  )
}
