import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import NotFound from "./common/NotFound";
import MainLayout from "./module/user/layouts/MainLayout";
import LoadingPage from "./components/LoadingPage";

// Lazy load components
const Home = lazy(() => import("./module/user/pages/Home"));
const About = lazy(() => import("./module/user/pages/About"));
const Search = lazy(() => import("./module/user/pages/Search"));
const VerifyEmail = lazy(() => import("./module/user/pages/VerifyEmail"));
const SignInPage = lazy(() => import("./module/user/pages/SignIn"));
const Post = lazy(() => import("./module/user/pages/Post"));
const Logout = lazy(() => import("./module/user/pages/Logout"));
const SignUpPage = lazy(() => import("./module/user/pages/SignUp"));
const CreateLayout = lazy(() => import("./module/user/layouts/CreateLayout"));
const Category = lazy(() => import("./module/user/pages/Fundraiser/Category"));
const Goal = lazy(() => import("./module/user/pages/Fundraiser/Goal"));
const Type = lazy(() => import("./module/user/pages/Fundraiser/Type"));
const Fund = lazy(() => import("./module/user/pages/Fund"));
const Description = lazy(() =>
  import("./module/user/pages/Fundraiser/Description")
);
const Media = lazy(() => import("./module/user/pages/Fundraiser/Media"));
const Finish = lazy(() => import("./module/user/pages/Fundraiser/Finish"));
const MyCampaigns = lazy(() => import("./module/user/pages/MyCampaigns"));
const Profile = lazy(() => import("./module/user/pages/Profile"));
const Discover = lazy(() => import("./module/user/pages/Discover"));
const DiscoverBrowse = lazy(() => import("./module/user/pages/DiscoverBrowse"));

// Loading component

// Wrap component with Suspense
// eslint-disable-next-line no-unused-vars
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingPage />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "about", element: withSuspense(About) },
      { path: "search", element: withSuspense(Search) },
      { path: "profile", element: withSuspense(Profile) },
      { path: "logout", element: withSuspense(Logout) },
      { path: "discover", element: withSuspense(Discover) },
      { path: "discover/:id", element: withSuspense(DiscoverBrowse) },
      { path: "my-campaigns", element: withSuspense(MyCampaigns) },
      { path: "post/:slug", element: withSuspense(Post) },
      { path: "fund/:id", element: withSuspense(Fund) },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/sign-in",
    element: withSuspense(SignInPage),
  },
  {
    path: "/verify-email",
    element: withSuspense(VerifyEmail),
  },
  {
    path: "/sign-up",
    element: withSuspense(SignUpPage),
  },
  {
    path: "/create/fundraiser",
    element: withSuspense(CreateLayout),
    children: [
      {
        path: "category",
        element: withSuspense(Category),
      },
      {
        path: "goal",
        element: withSuspense(Goal),
      },
      {
        path: "types",
        element: withSuspense(Type),
      },
      {
        path: "description",
        element: withSuspense(Description),
      },
      {
        path: "media",
        element: withSuspense(Media),
      },
      {
        path: "finish",
        element: withSuspense(Finish),
      },
    ],
  },
]);

export default router;
