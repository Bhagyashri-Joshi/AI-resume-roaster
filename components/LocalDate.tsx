"use client";

import { useEffect, useState } from "react";

/**
 * Renders a timestamp in the viewer's own locale and time zone. Formatting
 * on the server would use the server's zone (UTC on Vercel) and can show a
 * different day than the browser does, so we format after mount.
 */
export default function LocalDate({ iso }: { iso: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }));
  }, [iso]);

  return <time dateTime={iso}>{text}</time>;
}
