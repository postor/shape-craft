import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';

// Mounts the React application into the existing #app element. The previous
// vanilla hash-router in main.ts is replaced by <App/>, which renders the
// matching React view based on location.hash and re-renders on hashchange.
export function mountApp(container: HTMLElement): Root {
  const root = createRoot(container);
  root.render(<App />);
  return root;
}
