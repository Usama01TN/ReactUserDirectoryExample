# People Directory

A small React app that loads a list of users from the
[JSONPlaceholder API](https://jsonplaceholder.typicode.com/users) and lets you
search them by name and expand a row to see more details.

Built with React, Vite and axios as a practice project for data fetching,
loading and error states, and basic interactivity.

## Features:

- Fetches users with `axios.get` inside a `useEffect` hook.
- Shows a loading message while the request is in progress.
- Shows an error message if the request fails.
- Lists each user's name, email and company name.
- Filters users by name as you type (case-insensitive).
- Click a user to expand or collapse their address, phone and website.
- Responsive layout with keyboard-accessible rows.

## Getting started:

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Then open the local URL that Vite prints (usually http://localhost:5173).

### Other scripts:

| Command           | What it does                      |
| ----------------- | --------------------------------- |
| `npm run build`   | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint`    | Checks the code with oxlint       |

## Project structure:

```
user-directory/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx        Entry point
    ├── App.jsx         Renders <UserList />
    ├── UserList.jsx    Fetching, state, search and expand/collapse
    ├── UserList.css    Styles for the directory
    └── index.css       Page background and reset
```

## How `UserList.jsx` works:

| State           | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `listOfUsers`   | The users returned by the API                   |
| `loading`       | `true` until the request finishes               |
| `error`         | The error message if the request fails          |
| `search`        | The current text in the search input            |
| `expandedId`    | The id of the open user, or `null`              |

- The request runs once on mount. An `AbortController` cancels it if the
  component unmounts.
- `loading` is set back to `false` in `.finally()`, so it ends whether the
  request succeeds or fails.
- The visible list is `listOfUsers` filtered by `search`, so the original data
  is never changed.
- Clicking a row sets `expandedId` to that user's id. Clicking it again sets it
  back to `null`.

## Testing the states:

- **Loading:** in browser DevTools, open the Network tab and set throttling to
  "Slow 3G", then refresh.
- **Error:** switch the Network tab to "Offline" and refresh, or change
  `API_URL` in `UserList.jsx` to a broken address.
- **Empty search:** type something that matches no name, like `zzz`.

## Ideas for next steps:

- Highlight the matching part of each name while searching.
- Add a retry button to the error message.
- Sort users by name or company.
- Show the details in a modal instead of inline.
