const base =
  process.env.DATA_BASE ||
  process.env.NEXT_PUBLIC_DATA_BASE ||
  "https://vivsrivas.github.io/gita-data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/gita-site";

export async function getStaticProps() {
  const safeFetchJSON = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        return null;
      }
      const text = await res.text();
      if (text.trim().startsWith("<")) {
        return null;
      }
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  const data = await safeFetchJSON(`${base}/about.json`);

  return {
    props: {
      note: data?.note || "",
      meta: data?.meta || null,
    }
  };
}

export default function AboutPage({ note, meta }) {
  return (
    <main className="min-h-screen bg-[#fdf8f3] text-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold text-[#c77d28] mb-6">
          About Bhagavad Gita Explorer
        </h1>

        {note ? (
          <div className="bg-white rounded-lg shadow-md p-6 leading-relaxed whitespace-pre-line">
            {note}
          </div>
        ) : (
          <p className="text-gray-600">
            We’re preparing additional details about this project. Please check
            back soon.
          </p>
        )}

        {meta && (
          <div className="mt-6 text-sm text-gray-500 space-y-2">
            {meta.updated && (
              <p>
                <span className="font-medium text-gray-700">Last updated:</span>{" "}
                {meta.updated}
              </p>
            )}
            {meta.source && (
              <p>
                <span className="font-medium text-gray-700">Source:</span>{" "}
                <a
                  href={meta.source}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {meta.source}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <a
            href={`${basePath}/`}
            className="inline-block text-[#c77d28] font-medium border border-[#c77d28] rounded-md px-4 py-2 hover:bg-[#c77d28] hover:text-white transition"
          >
            ⟵ Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}

