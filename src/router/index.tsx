/**
 * Author: Libra
 * Date: 2023-12-05 13:42:14
 * LastEditors: Libra
 * Description:
 */
import { createBrowserRouter } from "react-router-dom";
import { LoginView } from "@/views/login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
]);

export default router;
