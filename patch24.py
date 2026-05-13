with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

css_append = """
.subtitle-badge.blue-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
"""

if 'blue-badge' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
