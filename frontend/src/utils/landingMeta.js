const META = {
  title: "VerdeWatt — Smart EV Charging for High-Rise Buildings",
  description:
    "AI-powered EV charging orchestration for apartments and smart buildings. Forecast load, allocate power safely, and track impact for residents and operators.",
};

export function applyLandingMeta(ogImageUrl) {
  document.title = META.title;

  const tags = [
    { name: "description", content: META.description },
    { property: "og:title", content: META.title },
    { property: "og:description", content: META.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: META.title },
    { name: "twitter:description", content: META.description },
  ];

  if (ogImageUrl) {
    tags.push(
      { property: "og:image", content: ogImageUrl },
      { name: "twitter:image", content: ogImageUrl }
    );
  }

  tags.forEach(({ name, property, content }) => {
    const selector = name
      ? `meta[name="${name}"]`
      : `meta[property="${property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      element = document.createElement("meta");
      if (name) {
        element.setAttribute("name", name);
      }
      if (property) {
        element.setAttribute("property", property);
      }
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  });
}

export function resetAppMeta() {
  document.title = "VerdeWatt — Building Operations";
}
