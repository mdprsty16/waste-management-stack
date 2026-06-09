import { getApiDocs } from "../lib/swagger";
import ReactSwagger from "./react-swagger";

// Interseptor Server-side untuk membungkam DeprecationWarning url.parse dari library luar
if (typeof window === 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('url.parse') || msg.includes('DEP0169')) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('url.parse') || msg.includes('DEP0169')) return;
    originalError(...args);
  };
}

export default async function ApiDocsPage() {
  const spec = await getApiDocs();
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <section className="container">
        <ReactSwagger spec={spec} />
      </section>
    </div>
  );
}