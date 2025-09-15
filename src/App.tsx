import { createBrowserRouter, RouterProvider } from "react-router";
import FeedPage from "./pages/Feed";
import Home from "./pages/Home";
import AppLayOut from "./components/AppLayOut";
import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayOut,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/feed",
        Component: FeedPage,
      },
      {
        path: "/authpage",
        Component: AuthPage,
      },
      {
        path: "/profile-setup",
        Component: ProfileSetupPage,
      },
    ],
  },
]);

export default function App() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      {!online && (
        <div className="bg-yellow-500 text-black text-center py-2">
          ⚠️ You’re offline. Posts are loaded from your device.
        </div>
      )}
      <RouterProvider router={router} />;
    </div>
  );
}
