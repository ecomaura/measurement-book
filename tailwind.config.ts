import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#E8DFC9", // raw linen backdrop
        card: "#F7F2E4", // index card paper
        ink: "#28221C", // fountain-pen ink
        "ink-soft": "#5A5044",
        tape: "#A63D40", // measuring-tape red — latest / primary actions
        "tape-dark": "#832F31",
        thread: "#2F6B66", // stitched-teal — secondary accent
        brass: "#A9812F", // hardware accent, used sparingly
        line: "#CFC3A3", // hairline / dotted leaders
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        canvas:
          "radial-gradient(circle at 1px 1px, rgba(40,34,28,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        weave: "14px 14px",
      },
    },
  },
  plugins: [],
};
export default config;
