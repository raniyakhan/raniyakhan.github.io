// Guestbook notes: saved to Supabase when guestbook.config.js is filled in,
// otherwise kept in this browser (preview mode) with a few sample notes.
import { SUPABASE_URL, SUPABASE_KEY } from './guestbook.config.js'

export const LIMITS = { name: 40, message: 160 }
export const PAPERS = { butter: '#fff1a6', pink: '#ffd9e2', mint: '#d5f0da', sky: '#d7e7fb', white: '#ffffff' }
export const PENS = ['#23201d', '#b4312a', '#2f5fb3', '#3d8b4f', '#e07aa0']
// doodles are drawn on a 300 x 200 pad and saved as a list of strokes { c: pen, d: svg path }
export const PAD = { w: 300, h: 200 }

export const live = Boolean(SUPABASE_URL && SUPABASE_KEY)
const api = `${SUPABASE_URL}/rest/v1/guestbook`
// older "anon" keys are JWTs and also go in Authorization; newer publishable keys only go in apikey
const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(SUPABASE_KEY.startsWith('eyJ') && { Authorization: `Bearer ${SUPABASE_KEY}` }) }

const SAMPLES = [
  { id: 's1', name: 'a friend', message: 'the rug!!! i need it', paper: 'mint', doodle: [] },
  { id: 's2', name: 'someone in nyc', message: 'hi from washington square park', paper: 'butter', doodle: [
    { c: '#e0a020', d: 'M150 100 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0' },
    { c: '#e0a020', d: 'M150 46 L150 26 M150 154 L150 174 M96 100 L76 100 M204 100 L224 100 M112 62 L98 48 M188 62 L202 48 M112 138 L98 152 M188 138 L202 152' },
    { c: '#23201d', d: 'M138 94 L138 96 M162 94 L162 96 M136 112 Q150 124 164 112' },
  ] },
  { id: 's3', name: 'a stranger', message: 'very cool room. hope the orchid is doing well', paper: 'pink', doodle: [
    { c: '#b4312a', d: 'M150 70 C132 38 88 50 100 88 C108 114 140 130 150 152 C160 130 192 114 200 88 C212 50 168 38 150 70' },
  ] },
]

const KEY = 'guestbook-notes'
const readLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] } }
const writeLocal = (notes) => { try { localStorage.setItem(KEY, JSON.stringify(notes)) } catch { /* private window */ } }

// newest first
export async function listNotes() {
  if (!live) return [...readLocal(), ...SAMPLES]
  const res = await fetch(`${api}?select=id,name,message,doodle,paper,created_at&order=created_at.desc&limit=300`, { headers })
  if (!res.ok) throw new Error(`guestbook ${res.status}`)
  return res.json()
}

export async function addNote({ name, message, doodle, paper }) {
  const note = { name: name.trim().slice(0, LIMITS.name), message: message.trim().slice(0, LIMITS.message), doodle, paper }
  if (!live) {
    const saved = { ...note, id: `local-${Date.now()}` }
    writeLocal([saved, ...readLocal()])
    return saved
  }
  // return=minimal so a hidden-by-default table still accepts the note
  const res = await fetch(api, { method: 'POST', headers: { ...headers, Prefer: 'return=minimal' }, body: JSON.stringify(note) })
  if (!res.ok) throw new Error(`guestbook ${res.status}`)
  return { ...note, id: `new-${Date.now()}` }
}

// turn raw pointer points into a short path, dropping points closer than 2 units
export function toPath(points) {
  const kept = []
  for (const p of points) {
    const last = kept.at(-1)
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) >= 2) kept.push(p)
  }
  if (points.length > 1) kept.push(points.at(-1))
  const xy = (p) => `${Math.round(Math.min(Math.max(p.x, 0), PAD.w))} ${Math.round(Math.min(Math.max(p.y, 0), PAD.h))}`
  if (kept.length === 1) kept.push(kept[0]) // a tap still leaves a dot
  return kept.map((p, i) => `${i ? 'L' : 'M'}${xy(p)}`).join(' ')
}

// only draw strokes that look like ours (the database is writable by anyone)
const PATH_OK = /^[MLCQamlq0-9 .-]+$/
export const cleanDoodle = (d) => (Array.isArray(d) ? d.filter((s) => s && typeof s.d === 'string' && PATH_OK.test(s.d)).slice(0, 400) : [])
export const penColor = (c) => (/^#[0-9a-f]{6}$/i.test(c) ? c : PENS[0])
export const paperColor = (p) => PAPERS[p] ?? PAPERS.butter
