import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/auth/LoginPage.vue";
import HomePage from "../pages/client/HomePage.vue";
import AdminPage from "../pages/admin/AdminPage.vue";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.vue";
import StoryListPage from "../pages/admin/story/StoryListPage.vue";
import StoryFormPage from "../pages/admin/story/StoryFormPage.vue";
import ChapterListPage from "../pages/admin/story/ChapterListPage.vue";
import ChapterFormPage from "../pages/admin/story/ChapterFormPage.vue";
import AdminCategoryList from "../pages/admin/category/AdminCategoryList.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/admin",
    component: AdminPage,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: AdminDashboardPage,
      },
      {
        path: "stories",
        name: "AdminStoryList",
        component: StoryListPage,
      },
      {
        path: "stories/new",
        name: "AdminStoryNew",
        component: StoryFormPage,
      },
      {
        path: "stories/:id/edit",
        name: "AdminStoryEdit",
        component: StoryFormPage,
        props: true,
      },
      {
        path: "stories/:storyId/chapters",
        name: "AdminChapterList",
        component: ChapterListPage,
        props: true,
      },
      {
        path: "stories/:storyId/chapters/new",
        name: "AdminChapterNew",
        component: ChapterFormPage,
        props: true,
      },
      {
        path: "chapters/:id/edit",
        name: "AdminChapterEdit",
        component: ChapterFormPage,
        props: true,
      },
      {
        path: "categories",
        name: "AdminCategoryList",
        component: AdminCategoryList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    const raw = localStorage.getItem("currentUser");
    const user = raw ? JSON.parse(raw) : null;

    if (!user) {
      return next({ name: "Login" });
    }

    if (user.role !== "ADMIN") {
      return next({ name: "Home" });
    }
  }
  next();
});

export default router;
