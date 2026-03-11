import DOMPurify from "dompurify";
import parse from "html-react-parser";

export function sanitizer(description: string) {
  const text = DOMPurify.sanitize(description, {
    FORBID_TAGS: ["strong", "b", "em"],
  });
  return parse(text);
}
