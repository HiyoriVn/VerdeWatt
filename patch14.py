with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

old_css = """/* Smart Search */
.charging-filters .search-bar {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
}
.charging-filters .search-bar:focus-within {
  background: #ffffff !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(0,0,0,0.02);
}"""

new_css = """/* Smart Search */
.charging-filters .search-bar {
  background: var(--bg) !important;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}
.charging-filters .search-bar:focus-within {
  background: var(--card-bg) !important;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}"""

if old_css in content:
    content = content.replace(old_css, new_css)
else:
    # If indentation is different, we can append the dark mode override
    print("Warning: exact string not found. Appending dark mode override.")
    content += """\n
.dark .charging-filters .search-bar {
  background: var(--bg) !important;
  border: 1px solid var(--border);
}
.dark .charging-filters .search-bar:focus-within {
  background: var(--card-bg) !important;
}
"""

with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
    f.write(content)
