import { useEffect } from "react";

interface MetaTagsOptions {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
}

export function useMetaTags({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
}: MetaTagsOptions) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(
        `meta[${attr}="${name}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("twitter:description", description);
    }
    setMeta("og:title", ogTitle || title, true);
    if (ogDescription || description) {
      setMeta("og:description", ogDescription || description || "", true);
    }
    setMeta("og:type", ogType, true);
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", ogTitle || title);

    return () => {
      // Cleanup not needed; next page will override
    };
  }, [title, description, ogTitle, ogDescription, ogType]);
}
