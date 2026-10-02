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
