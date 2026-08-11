import "@/Styles/HomePage.css";

export default function SideBar() {
  return (
    <>
      <aside className="sidebar">
        <div className="logo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 21c1-4 2-14 8-16 6 2 7 12 8 16" />
            <path d="M4 21h16" />
          </svg>
        </div>
        <nav>
          <div className="nav-btn active" title="Discover">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M14.5 9.5L10 14l1-4.5 4.5-1L14.5 9.5z" />
            </svg>
          </div>
          <div className="nav-btn" title="Favorites">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20.5c-1.1-1.1-7.5-5.9-9.2-9.2A5.2 5.2 0 0 1 7.6 4.5c1.7 0 2.8.8 3.4 1.8.6-1 1.7-1.8 3.4-1.8a5.2 5.2 0 0 1 4.8 6.8c-1.7 3.3-8.1 8.1-9.2 9.2Z" />
            </svg>
          </div>
          <div className="nav-btn" title="Settings">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        </nav>
        <div className="avatar-btn">
          <img src="https://i.pravatar.cc/80?img=32" alt="Profile" />
        </div>
      </aside>
    </>
  );
}
