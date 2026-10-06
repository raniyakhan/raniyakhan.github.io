# raniya's room

Source for the homepage of raniyakhan.github.io: one room collage where every object is clickable.

- `src/room.js` holds every object (image, position as a percent of the room, section, title, text) plus the about page and experiences.
- `src/App.jsx` draws the room and the notes.

Work on it locally:

    cd site
    npm install
    npm run dev

Publish it: `npm run deploy` builds into the repo root (`../index.html` and `../assets/`), then commit and push.
It never touches the class project folders (`1/`, `2/`, `3/`) or `style.css`.

## Guestbook

Visitors leave a note or doodle from the sticky notes on the wall (or the header link). Notes live in a free Supabase table:

1. Make a project at supabase.com, open SQL Editor, and run `guestbook.sql`.
2. Copy the Project URL and the publishable key (or the older anon key) from Project Settings > API into `src/guestbook.config.js`.

Until then it runs in preview mode (sample notes, saved only in your browser).
To remove a note, open Table Editor > guestbook and delete the row or tick `hidden`.
