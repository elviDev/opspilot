import type { Graph, Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  data: Graph | WithContext<Thing>;
};

/**
 * Renders structured data. `<` is escaped so a value containing
 * `</script>` can't break out of the tag (see Next.js JSON-LD guide).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
