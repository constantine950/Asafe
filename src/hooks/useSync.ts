import { useEffect, useState } from "react";
import { syncPosts } from "../sync";

export function useSync() {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    async function handleSync() {
      if (navigator.onLine) {
        setStatus("syncing");
        await syncPosts();
        setStatus("done");
      }
    }

    handleSync();

    window.addEventListener("online", handleSync);
    return () => window.removeEventListener("online", handleSync);
  }, []);

  return status;
}
