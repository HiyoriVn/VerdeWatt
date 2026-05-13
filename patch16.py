with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove isDashboardOverview variable
old_var = """  const isDashboardOverview =
    activeTab === "dashboard" || activeTab === "charging-sessions";"""
content = content.replace(old_var, "")

# Update the main wrapper
old_wrapper = """    <div
      className={`dashboard-page ${
        isDashboardOverview
          ? "dashboard-reference"
          : ""
      }`}
    >"""
new_wrapper = """    <div className="dashboard-page dashboard-reference">"""
content = content.replace(old_wrapper, new_wrapper)

# Update the right side of the header
old_header_right = """          {isDashboardOverview ? (
            <button
              type="button"
              className="dashboard-action-btn"
              aria-label="View notifications"
            >
              <Bell size={16} />
            </button>
          ) : null}

          <button
            type="button"
            className={`theme-toggle-btn ${
              isDashboardOverview
                ? "theme-toggle-btn-compact"
                : ""
            }`}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
            {!isDashboardOverview ? (
              <span>
                {theme === "dark"
                  ? "Light"
                  : "Dark"}
              </span>
            ) : null}
          </button>"""

new_header_right = """          <button
            type="button"
            className="dashboard-action-btn"
            aria-label="View notifications"
          >
            <Bell size={16} />
          </button>

          <button
            type="button"
            className="theme-toggle-btn theme-toggle-btn-compact"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>"""

content = content.replace(old_header_right, new_header_right)

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
