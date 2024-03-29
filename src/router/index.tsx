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
import { AddBlogView } from "@/views/admin/blog/add";
import { TagCategoryView } from "@/views/admin/blog/tagCategory";
import { BlogListView } from "@/views/admin/blog/list";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BlogHomeView } from "@/views/blog/home";
import { BlogRecentView } from "@/views/blog/list";
import { BlogLayout } from "@/layout/blog";
import { BlogDetailView } from "@/views/blog/detail";
import { BlogCategoryView } from "@/views/blog/category";
import { BlogTagView } from "@/views/blog/tag";
import { BlogWordView } from "@/views/blog/word";
import { WordListView } from "@/views/admin/blog/wlist";
import { EditBlogView } from "@/views/admin/blog/edit";
import { AboutView } from "@/views/blog/about";

const routers = [
  {
    path: "/",
    element: <Navigate to="/blog/home" />,
  },
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
        children: [
          {
            path: "/admin/blog",
            element: <Navigate to="/admin/blog/list" />,
          },
          {
            path: "list",
            element: <BlogListView />,
          },
          {
            path: "add",
            element: <AddBlogView />,
          },
          {
            path: "tc",
            element: <TagCategoryView />,
          },
          {
            path: "edit/:id",
            element: <EditBlogView />,
          },
        ],
      },
      {
        path: "word",
        children: [
          {
            path: "/admin/word",
            element: <Navigate to="/admin/word/list" />,
          },
          {
            path: "list",
            element: <WordListView />,
          },
        ],
      },
    ],
  },
  {
    path: "/blog",
    element: <BlogLayout />,
    children: [
      {
        path: "recent",
        element: <BlogRecentView />,
      },
      {
        path: "home",
        element: <BlogHomeView />,
      },
      {
        path: "detail/:id",
        element: <BlogDetailView />,
      },
      {
        path: "category",
        element: <BlogCategoryView />,
      },
      {
        path: "tag",
        element: <BlogTagView />,
      },
      {
        path: "word",
        element: <BlogWordView />,
      },
      {
        path: "about",
        element: <AboutView />,
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
    console.log("location.pathname", location.pathname);
    if (
      whiteList.includes(location.pathname) ||
      location.pathname.includes("/blog")
    ) {
      return;
    } else if (token) {
      return;
    } else {
      navigate("/login");
    }
  }, [location, navigate, token]);

  return useRoutes(routers);
}
