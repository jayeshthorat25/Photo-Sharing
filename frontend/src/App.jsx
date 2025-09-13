import { Routes, Route } from "react-router-dom";

import {
  Home,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  SharedPost,
  UpdateProfile,
  AllUsers,
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { ToastProvider } from "@/components/ui/SimpleToast";
import { SavedPostsProvider } from "@/context/SavedPostsContext";

import "./globals.css";
import Landing from "./_auth/Landing";

const App = () => {
  return (
    <ToastProvider>
      <SavedPostsProvider>
        <Routes>
        {/* Landing page as the default route - full screen */}
        <Route index element={<Landing />} />
        
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* shared post route - accessible without authentication */}
        <Route path="/shared/:id" element={<SharedPost />} />

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
        </Routes>
      </SavedPostsProvider>
    </ToastProvider>
  );
};

export default App;
