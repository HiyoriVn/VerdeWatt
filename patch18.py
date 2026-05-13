with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

css_append = """
/* Unified Heights for Titles to prevent layout shifts across tabs */
.dashboard-reference .dashboard-header {
  min-height: 72px;
}

.dashboard-reference .dashboard-header p {
  min-height: 38px; /* Force 2 lines of space */
  display: flex;
  align-items: flex-start;
  margin-bottom: 0;
}

.section-title-wrap {
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.section-title-wrap p {
  min-height: 38px; /* Force 2 lines of space */
  display: flex;
  align-items: flex-start;
}
"""

if 'Unified Heights for Titles' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
