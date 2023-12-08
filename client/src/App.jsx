import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"
function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  )
}

export default App
