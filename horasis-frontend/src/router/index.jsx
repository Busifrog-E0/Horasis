// rrd
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// layouts
import RootLayout from '../layouts/RootLayout'
//pages
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'
import UnAuthLayout from '../layouts/UnAuthLayout'
import LogIn from '../pages/LogIn'
import WelcomePage from '../components/Login/WelcomePage'
import Activities from '../pages/Activities'
import Events from '../pages/Events'
import Discussions from '../pages/Discussions'
import Connections from '../pages/Connections'
import Analytics from '../pages/Analytics'
import CreateEvent from '../pages/CreateEvent'
import CreateDiscussion from '../pages/CreateDiscussion'
import SingleEvent from '../pages/SingleEvent'
import SingleDiscussion from '../pages/SingleDiscussion'
import MyProfile from '../pages/MyProfile'
import CreateArticle from '../pages/CreateArticle'
import Articles from '../pages/Articles'
import UniversalSearch from '../pages/UniversalSearch'
import UniversalSearchDetails from '../pages/UniversalSearchDetails'
import Home from '../pages/Home'
import Register from '../pages/Register'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='/' element={<AuthLayout />}>
        <Route path='/' element={<DashboardLayout />}>
          <Route path='/' element={<Activities />} />
          <Route path='/home' element={<Home />} />
        </Route>
        <Route path='welcome' element={<WelcomePage />} />
      </Route>
      <Route path='login' element={<UnAuthLayout />}>
        <Route index element={<LogIn />} />
      </Route>
      <Route path='register' element={<UnAuthLayout />}>
        <Route index element={<Register />} />
      </Route>
      <Route path='confirmotp' element={<UnAuthLayout />}>
        <Route index element={<Register />} />
      </Route>
    </Route>
  )
)
