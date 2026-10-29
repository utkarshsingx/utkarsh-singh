import { createRoot, type Root } from 'react-dom/client';
import TechText from './TechText';
import TargetCursor from './TargetCursor';
import FallingText from './FallingText';

/** Read a design token off :root so the components follow the theme toggle. */
const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';

const repaints: Array<() => void> = [];
const onTheme = (paint: () => void) => {
  paint();
  repaints.push(paint);
};
// main.js dispatches this right after it flips data-theme.
window.addEventListener('themechange', () => repaints.forEach(paint => paint()));

/* ---------- hero wordmark ---------- */
const wordmark = document.getElementById('techtext-root');
if (wordmark) {
  const root: Root = createRoot(wordmark);
  onTheme(() =>
    root.render(
      <TechText
        text="Utkarsh Singh"
        fontWeight={700}
        fontSize={124}
        letterSpacing={-0.035}
        align="left"
        color={token('--fg', '#f4f4f6')}
        accentColor={token('--accent', '#49ab9e')}
        reveal="letter"
        reach={190}
        dashLength={4}
        dashGap={2}
        strokeWidth={1.5}
        specks={14}
        guides
        intro="metrics"
        introDuration={2.2}
        clickKick
      />
    )
  );
}

/* ---------- stack: every pill falls ---------- */
const STACK = [
  'TypeScript', 'JavaScript', 'Python', 'Django', 'DRF', 'Celery', 'Redis',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Node.js', 'NestJS', 'Express', 'React',
  'Next.js', 'Expo', 'Tailwind', 'Vite', 'Docker', 'AWS', 'Fargate', 'S3',
  'Netlify', 'Vercel', 'Git', 'GitHub', 'Firebase', 'GCP', 'Judge0', 'OpenAI',
  'Razorpay', 'Postman', 'k6', 'C++'
].join(' ');

const stack = document.getElementById('stack-root');
if (stack) {
  const root: Root = createRoot(stack);
  onTheme(() =>
    root.render(
      <FallingText
        text={STACK}
        highlightWords={['TypeScript', 'Python', 'Django', 'React', 'PostgreSQL', 'AWS']}
        variant="tiles"
        trigger="scroll"
        order="random"
        stagger={0.035}
        gravity={1}
        bounciness={0.22}
        scatter={0.45}
        restoreDelay={3}
        cursorPush={0.6}
        fontSize="1rem"
        theme={isLight() ? 'light' : 'dark'}
        accentColor={token('--accent', '#49ab9e')}
      />
    )
  );
}

/* ---------- reticle cursor (portals itself to <body>) ---------- */
const cursorHost = document.createElement('div');
document.body.appendChild(cursorHost);
createRoot(cursorHost).render(
  <TargetCursor
    targetSelector=".cursor-target"
    spinDuration={3}
    hoverDuration={0.18}
    size={32}
    cornerSize={11}
    thickness={2}
    padding={8}
    dotSize={4}
    parallaxOn
    hideDefaultCursor
  />
);
