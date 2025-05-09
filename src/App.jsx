import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import InstructorAdd from "./pages/Instructor.jsx";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import AddInstructor from "./pages/AddInstructor";
import Courses from "./pages/Courses";
import AddCourse from "./pages/Courses/AddCourse.jsx";
import Blog from "./components/Blog/Blog";
import AddBlog from "./pages/AddBlog";
import AddBlogCate from "./pages/AddBlogCate";
import AddBlogPost from "./pages/AddBlogPost";
import AddFlyers from "./pages/AddFlyers";
import AddSpcategories from "./components/SP-C Categories/AddSpcategories";
import AddCategory from "./pages/Category/AddCate.jsx";
import Mainspc from "./components/SP-CBlogPost/Mainspc";
import MainspcCate from "./components/SP-C Categories/MainspcCate";
import MainEflyer from "./components/Eflyer/MainEflyer";
import AddSpecialbp from "./components/SP-CBlogPost/AddSpecialbp";
import Mainblog from "./components/Blog/Mainblog";
import Mainblogcat from "./components/Blog/Mainblogcat";
import EditCourse from "./components/courses/Getcourse/EditCourse.jsx";
import EditInstructor from "./components/users/EditInstructor";
import EditBlog from "./components/Blog/EditBlog";
import EditBlogcat from "./components/Blog/EditBlogcat";
import EditSpecialcat from "./components/SP-C Categories/EditSpecialcat";
import Editspecialbp from "./components/SP-C Categories/Editspecialbp";
import EditEFlyer from "./components/Eflyer/EditEFlyer";
import AddFaq from "./components/Faqs/AddFaq";
import MainFaqsquestion from "./components/faqQuestions/MainFaqsquestion";
import Editfaquestion from "./components/faqQuestions/Editfaquestion";
import MainFreeTrail from "./components/freetrailquerry/MainFreeTrail";
import MainEventcat from "./components/eventCategory/MainEventcat";
import EditeventCat from "./components/eventCategory/EditeventCat";
import AddEventsCategory from "./components/eventCategory/AddEventsCategory";
import MainEvents from "./components/events/MainEvents";
import AddFaqquestion from "./components/faqQuestions/AddFaqquestion";
import EventDetail from "./components/events/Eventdetail";
import Mainmodel from "./components/CourseModel/Mainmodel";
import AddModel from "./components/CourseModel/AddModel";
import EditModel from "./components/CourseModel/EditModel";
import AddEvents from "./components/events/AddEvents";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maincat from "./components/Menu/Maincat";
import EditMaincat from "./components/Menu/EditMaincat";
import AddMainCat from "./components/Menu/AddMainCat";
import Maincourse from "./components/Menu/Maincourse";
import Addmaincourse from "./components/Menu/Addmaincourse";
import Webbanner from "./pages/Webbanner";
import Allblogs from "./components/Blog/Allblogs.jsx";
import Addtermsandconditions from "./pages/Termsandconditions/Addtermsandconditions.jsx";
import Brouchuredata from "./pages/Brouchuredata/Brouchuredata.jsx";
import Faqs from "./components/Faqs/Faqs.jsx";
import EditFaq from "./components/Faqs/Editfaq.jsx";
import Privacypolicy from "./pages/Privacypolicy/Privacypolicy.jsx";
import Addnews from "./pages/News/Addnews.jsx";
import News from "./components/News/GetNews.jsx";
import EditNews from "./components/News/Edit.jsx";
import Addgallery from "./pages/Gallery/Addgallery.jsx";
import GalleryList from "./components/Gallery/Gallery.jsx";
import CategoryTable from "./components/category/CategoryTable.jsx";
import EditCategory from "./components/category/Editcategory.jsx";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/instructors" element={<InstructorAdd />}>
          <Route path="adduser" element={<AddInstructor />} />
        </Route>
        <Route path="/users/:userId" element={<EditInstructor />} />
        <Route path="/addfaqs" element={<AddFaq />} />
        <Route path="/addfaq" element={<AddFaq />} />
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/editcourse/:id" element={<EditCourse />} />

        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/addblog" element={<AddBlog />} />
        <Route path="/editblog/:id" element={<EditBlog />} />
        <Route path="/blog-categories" element={<Mainblogcat />}></Route>
        <Route path="/editblogcat/:id" element={<EditBlogcat />} />
        <Route path="/addblogcate" element={<AddBlogCate />} />
        <Route path="/blog-post" element={<Mainblog />}>
          <Route path="addblogpost" element={<AddBlogPost />} />
        </Route>
        <Route path="all-blogs" element={<Allblogs />} />
        <Route path="/eflayer" element={<MainEflyer />}></Route>
        <Route path="/addeflayer" element={<AddFlyers />} />
        <Route path="/editeflyer/:id" element={<EditEFlyer />} />
        <Route path="/sp-c-categories" element={<MainspcCate />}></Route>
        <Route path="/editspc/:id" element={<EditSpecialcat />} />
        <Route path="/addspc" element={<AddSpcategories />} />
        <Route path="/specialbp" element={<AddSpecialbp />} />
        <Route path="/sp-c-blog-post" element={<Mainspc />} />
        <Route path="/sp-c-blog-post/:id" element={<Editspecialbp />} />
        <Route path="/faquestion" element={<MainFaqsquestion />} />
        <Route path="/eventcat" element={<MainEventcat />} />
        <Route path="/editeventcat/:id" element={<EditeventCat />} />
        <Route path="/addevent" element={<AddEventsCategory />} />
        <Route path="/addevents" element={<AddEvents />} />
        <Route path="/eventdetail/:id" element={<EventDetail />} />
        <Route path="/editfaquestion/:id" element={<Editfaquestion />} />
        <Route path="/addfaquestion" element={<AddFaqquestion />} />
        {/* main category  */}
        <Route path="/subcat" element={<Maincat />} />
        <Route path="/editsubcat/:id" element={<EditMaincat />} />
        <Route path="/addsubcat" element={<AddMainCat />} />
        {/* main subcourse */}
        <Route path="/maincourse" element={<Maincourse />} />
        <Route path="/addmainc" element={<Addmaincourse />} />

        <Route path="/event-post" element={<MainEvents />} />
        <Route path="/freetrail" element={<MainFreeTrail />} />
        <Route path="/coursemodel" element={<Mainmodel />} />
        <Route path="/addcoursemodel" element={<AddModel />} />
        <Route path="/editmodel/:id" element={<EditModel />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/web-banner" element={<Webbanner />} />
        <Route path="/termsandconditions" element={<Addtermsandconditions />} />
        <Route path="/privacypolicy" element={<Privacypolicy />} />
        <Route path="/brouchuredata" element={<Brouchuredata />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/editfaq/:id" element={<EditFaq />} />
        <Route path="/course-categories" element={<CategoryTable />} />
        <Route path="/add-categories" element={<AddCategory />} />
        <Route path="/edit-category/:id" element={<EditCategory />} />
        <Route path="/addnews" element={<Addnews />} />
        <Route path="/news" element={<News />} />
        <Route path="/editnews/:id" element={<EditNews />} />
        <Route path="/gallery" element={<GalleryList />} />
        <Route path="/addgallery" element={<Addgallery />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
