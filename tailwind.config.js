/** @type {import('tailwindcss').Config} */
export default {
  // Only the React Bits components use Tailwind; the rest of the site is a
  // hand-written design system, so preflight stays off to avoid resetting it.
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: []
};
