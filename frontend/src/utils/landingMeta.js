const META = {
  title: "VerdeWatt — Smart EV Charging for High-Rise Buildings",
  description:
    "AI-powered EV charging orchestration for apartments and smart buildings. Forecast load, allocate power safely, and track impact for residents and operators.",
};

const MANAGED_TAGS = [
  { name: "description" },
  { property: "og:title" },
  { property: "og:description" },
  { property: "og:type" },
  { name: "twitter:card" },
  { name: "twitter:title" },
  { name: "twitter:description" },
  { property: "og:image" },
  { name: "twitter:image" },
];

let previousMetaState = null;

function getSelector({ name, property }) {
  return name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
}

export function applyLandingMeta(ogImageUrl) {
  if (!previousMetaState) {
    previousMetaState = {
      title: document.title,
      tags: MANAGED_TAGS.map((tag) => {
        const element = document.querySelector(getSelector(tag));
        return {
          ...tag,
          existed: Boolean(element),
          content: element?.getAttribute("content") ?? "",
        };
      }),
    };
  }

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
    const selector = getSelector({ name, property });
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
  if (!previousMetaState) {
    document.title = "VerdeWatt — Building Operations";
    return;
  }

  document.title = previousMetaState.title;

  previousMetaState.tags.forEach(({ name, property, existed, content }) => {
    const selector = getSelector({ name, property });
    const element = document.querySelector(selector);

    if (!element) {
      if (!existed) {
        return;
      }

      const restored = document.createElement("meta");
      if (name) {
        restored.setAttribute("name", name);
      }
      if (property) {
        restored.setAttribute("property", property);
      }
      restored.setAttribute("content", content);
      document.head.appendChild(restored);
      return;
    }

    if (!existed) {
      element.remove();
      return;
    }

    element.setAttribute("content", content);
  });

  previousMetaState = null;
}
