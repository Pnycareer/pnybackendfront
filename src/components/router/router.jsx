import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Sidebar from "../common/Sidebar";
import App from "../../App";
import Login from "../../pages/Auth/Login";
import PrivateRoute from "../protectedroutes/PrivateRoute";
import AccessDenied from "../../pages/AccessDenied/Accessdenied";

const Webbanner = lazy(() => import("../../pages/Webbanner"));
const CategoryTable = lazy(() => import("../category/CategoryTable"));
const AddCategory = lazy(() => import("../../pages/Category/AddCate"));
const EditCategory = lazy(() => import("../category/Editcategory"));
const Courses = lazy(() => import("../../pages/Courses/Course"));
const AddCourse = lazy(() => import("../../pages/Courses/AddCourse"));
const EditCourse = lazy(() => import("../courses/Getcourse/EditCourse"));
const CourseModulesTable = lazy(() =>import("../../pages/CourseModel/ModelCourse"));
const EditModel = lazy(() => import("../../pages/CourseModel/EditModel"));
const AddModel = lazy(() => import("../../pages/CourseModel/AddModel"));
const Allblogs = lazy(() => import("../../pages/Blog/Allblogs"));
const Blog = lazy(() => import("../../pages/Blog/Blog"));
const EditBlog = lazy(() => import("../../pages/Blog/EditBlog"));
const Instructors = lazy(() => import("../../pages/Instructors/Instructors"));
const Addinstructors = lazy(() =>import("../../pages/Instructors/AddInstructor"));
const EditInstructor = lazy(() =>import("../../pages/Instructors/EditInstructor"));
const Register = lazy(() => import("../../pages/Auth/Register"));
const Users = lazy(() => import("../../pages/Users/Allusers"));
const Geteflayer = lazy(() => import("../../pages/Eflyer/GetEflyers"));
const posteflayer = lazy(() => import("../../pages/Eflyer/Eflayer"));
const editeflayer = lazy(() => import("../../pages/Eflyer/EditEflyers"));

// Wrapper for Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // Auth-Routes
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/403",
    element: <AccessDenied />,
  },

  // Dashboard-Routes
  {
    path: "/dashboard", element: (
      <PrivateRoute>
        <Sidebar />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <h1>Home</h1> },

      // Web-Banner
      {
        path: "web-banner",
        element: withSuspense(Webbanner),
      },

      // Category
      {
        path: "course-categories",
        element: (
          <PrivateRoute allowedRoles={["admin", 'modifier' , "superadmin"]}>
            {withSuspense(CategoryTable)}
          </PrivateRoute>
        ),
      },
      // Users
      {
        path: "register",
        element: (
          <PrivateRoute allowedRoles={["superadmin"]}>
            {withSuspense(Register)}
          </PrivateRoute>
        ),
      },
      {
        path: "users",
        element: <PrivateRoute allowedRoles={["superadmin"]}>{withSuspense(Users)}</PrivateRoute>,
      },

      // Categories
      { path: "add-categories", element: withSuspense(AddCategory) },
      { path: "edit-category/:id", element: withSuspense(EditCategory) },

      // Courses
      { path: "courses", element: withSuspense(Courses) },
      { path: "addcourse", element: withSuspense(AddCourse) },
      { path: "editcourse/:id", element: withSuspense(EditCourse) },

      // Course-Model
      { path: "coursemodel", element: withSuspense(CourseModulesTable) },
      { path: "editmodel/:id", element: withSuspense(EditModel) },
      { path: "addcoursemodel", element: withSuspense(AddModel) },

      // Blogs
      { path: "all-blogs", element: withSuspense(Allblogs) },
      { path: "blog-post", element: withSuspense(Blog) },
      { path: "editblog/:id", element: withSuspense(EditBlog) },

      // Instructor
      { path: "instructors", element: withSuspense(Instructors) },
      { path: "addinstructors", element: withSuspense(Addinstructors) },
      { path: "editinstructors/:id", element: withSuspense(EditInstructor) },

      // E-flyers
      { path: "eflayer", element: withSuspense(Geteflayer) },
      { path: "add-eflayer", element: withSuspense(posteflayer) },
      { path: "edit-eflayer/:id", element: withSuspense(editeflayer) },
    ],
  },
]);

export default router;
