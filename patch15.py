with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

if 'position: relative;' not in content[content.find('.sidebar-nav-item {'):content.find('}', content.find('.sidebar-nav-item {'))]:
    content = content.replace('.sidebar-nav-item {', '.sidebar-nav-item {\n  position: relative;')

css_append = """
.sidebar-nav-item-active::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #16a34a; /* Matches the green from the gradient */
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 8px rgba(22, 163, 74, 0.4);
}
"""

if '.sidebar-nav-item-active::before' not in content:
    content += css_append

with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
    f.write(content)
