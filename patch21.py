with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

css_append = """
/* Fix height equalization for top grid cards */
.charging-hero-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.charging-hero-wrapper .hero-banner {
  flex: 1;
  display: flex;
  flex-direction: column;
}
"""

if 'Fix height equalization for top grid cards' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
