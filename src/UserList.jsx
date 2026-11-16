import { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

// "Mrs. Dennis Schulist" -> "DS" (skips titles like Mr./Mrs./Dr.)
function getInitials(name) {
  const parts = name.split(" ").filter((p) => !/^(mr|mrs|ms|dr)\.?$/i.test(p));
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function UserList() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // The controller lets us cancel the request if the component unmounts
    const controller = new AbortController();

    axios
      .get(API_URL, { signal: controller.signal })
      .then((response) => {
        setListOfUsers(response.data);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const toggleUser = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const filteredUsers = listOfUsers.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) {
    return <p className="status">Loading users...</p>;
  }

  if (error) {
    return (
      <p className="status status-error" role="alert">
        We couldn&rsquo;t load the users ({error}). Check your connection and
        refresh the page.
      </p>
    );
  }

  return (
    <section className="directory">
      <header className="directory-header">
        <h1>People directory</h1>
        <p className="directory-count">
          Showing {filteredUsers.length} of {listOfUsers.length} people
        </p>
      </header>

      <label className="search">
        <span className="search-label">Search by name</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Try &ldquo;Clementine&rdquo;"
        />
      </label>

      {filteredUsers.length === 0 ? (
        <p className="status">No one matches &ldquo;{search}&rdquo;.</p>
      ) : (
        <ul className="user-list">
          {filteredUsers.map((user) => {
            const isOpen = expandedId === user.id;
            return (
              <li key={user.id} className={`user ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="user-summary"
                  onClick={() => toggleUser(user.id)}
                  aria-expanded={isOpen}
                  aria-controls={`details-${user.id}`}
                >
                  <span className="avatar" aria-hidden="true">
                    {getInitials(user.name)}
                  </span>
                  <span className="user-main">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </span>
                  <span className="user-company">{user.company.name}</span>
                  <span className="chevron" aria-hidden="true" />
                </button>

                {isOpen && (
                  <dl className="user-details" id={`details-${user.id}`}>
                    <div>
                      <dt>Address</dt>
                      <dd>
                        {user.address.suite}, {user.address.street}
                        <br />
                        {user.address.city} {user.address.zipcode}
                      </dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{user.phone}</dd>
                    </div>
                    <div>
                      <dt>Website</dt>
                      <dd>{user.website}</dd>
                    </div>
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default UserList;
