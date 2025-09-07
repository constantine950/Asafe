import { createBrowserRouter, RouterProvider } from "react-router";
import FeedPage from "./pages/Feed";
import Home from "./pages/Home";
import AppLayOut from "./components/AppLayOut";

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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
