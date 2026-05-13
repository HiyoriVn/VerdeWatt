with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

css_append = """
.subtitle-badge.amber-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
"""

if 'amber-badge' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
