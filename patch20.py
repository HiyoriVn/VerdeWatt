with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

css_append = """
/* Make all section titles 22px font size */
.section-title-wrap h3,
.card > h3 {
  font-size: 22px !important;
}
"""

if 'Make all section titles 22px' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
