import sanitizeHtml from "sanitize-html";

export const clean = (value) => {
  if (typeof value !== "string") return value;
  return sanitizeHtml(value.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });
};

export const cleanObject = (payload = {}) =>
  Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, clean(value)]));
