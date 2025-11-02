import '../styles/globals.css';
import '../styles/layout.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="app-container">
      <Component {...pageProps} />
      <footer>
        <p>© Bhagavad Gītā Project | Data from GitHub</p>
      </footer>
    </div>
  );
}
