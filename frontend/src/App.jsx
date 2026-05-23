import { useEffect, useState } from "react";

function App() {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setApiData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-6">
          CODEX DIVINE
        </h1>

        <p className="text-gray-400 text-xl mb-8">
          AI DevOps Assistant Platform
        </p>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-2xl mb-4 font-semibold">
            Backend Status
          </h2>

          {apiData ? (
            <div className="space-y-2 text-left">
              <p>
                <span className="font-bold">Project:</span>{" "}
                {apiData.project}
              </p>

              <p>
                <span className="font-bold">Status:</span>{" "}
                {apiData.status}
              </p>

              <p>
                <span className="font-bold">Message:</span>{" "}
                {apiData.message}
              </p>
            </div>
          ) : (
            <p>Loading API...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
