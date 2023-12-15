/**
 * Author: Libra
 * Date: 2023-12-05 13:42:14
 * LastEditors: Libra
 * Description:
 */
import {
  Navigate,
  useRoutes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LoginView } from "@/views/admin/login";
import { AdminView } from "@/views/admin";
import { AdminLayout } from "@/layout/admin";
import { BlankLayout } from "@/layout/blank";
import { BlogView } from "@/views/admin/blog";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const routers = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Navigate to="/admin/home" />,
      },
      {
        path: "home",
        element: <AdminView />,
      },
      {
        path: "blog",
        element: <BlogView />,
      },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "login",
        element: <LoginView />,
      },
    ],
  },
];

export default function Router() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  useEffect(() => {
    const whiteList = ["/login", "/404"];
    if (whiteList.includes(location.pathname)) {
      return;
    } else if (token) {
      return;
    } else {
      navigate("/login");
    }
  }, [location, navigate, token]);

  return useRoutes(routers);
}
