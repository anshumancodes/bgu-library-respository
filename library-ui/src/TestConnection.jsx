import { useState, useEffect } from "react";
import DSpaceApi from "./services/dspaceApi";

export default function TestDSpaceConnection() {
  const [result, setResult] = useState("Testing connection...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      const dspaceApi = new DSpaceApi("/api"); // goes through Vite proxy

      try {
        console.log("Testing DSpace API connection...");
        console.log("Base URL:", dspaceApi.baseUrl);

        // 1. Test basic API health
        const health = await dspaceApi.healthCheck();
        console.log("Health check:", health);

        if (health) {
          // 2. Try to fetch communities
          const communities = await dspaceApi.getCommunities(0, 1);
          console.log("Communities response:", communities);

          setResult(`✅ Success! Connected to DSpace API
Base URL: ${dspaceApi.baseUrl}
Found ${communities.page?.totalElements || 0} communities
Example: ${communities._embedded?.communities?.[0]?.name || "None"}`);
        } else {
          setResult(`❌ API health check failed
Base URL: ${dspaceApi.baseUrl}`);
        }
      } catch (error) {
        console.error("Connection test failed:", error);
        setResult(`❌ Connection failed: ${error.message}
Base URL: ${dspaceApi.baseUrl}

Check:
1. DSpace server is running (http://10.120.4.59:8080)
2. CORS is configured if calling directly
3. Vite proxy is configured if calling via /api`);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        backgroundColor: loading
          ? "#f0f0f0"
          : result.includes("✅")
          ? "#d4edda"
          : "#f8d7da",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontFamily: "monospace",
        whiteSpace: "pre-line",
      }}
    >
      {loading ? "🔄 Testing..." : result}
    </div>
  );
}
