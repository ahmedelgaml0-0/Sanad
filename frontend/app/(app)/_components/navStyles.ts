// Shared by every row in the rail. Labels stay in the DOM (screen readers read them) and only fade in visually.
export const railRow = "flex h-12 w-full items-center gap-4 rounded-2xl px-3 transition-colors";

// No font size here: each row sets its own, since two size classes on one element don't override reliably.
export const railLabel =
  "whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150 group-has-focus-visible:opacity-100 motion-reduce:transition-none";
