import '../styles/globals.css';
import '../styles/layout.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="app-container">
      <header>
        <h1><a href="/">Bhagavad Gītā Explorer</a></h1>
      </header>
      <Component {...pageProps} />
      <footer>
        <p>© Bhagavad Gītā Project | Data from GitHub</p>
      </footer>
    </div>
  );
}
