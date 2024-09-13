// rrd
import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// layouts
import RootLayout from '../layouts/RootLayout'
import SuperAdminLayout from '../layouts/superadmin/SuperAdminLayout'
import SuperAdminAuthLayout from '../layouts/superadmin/SuperAdminAuthLayout'
import SuperAdminUnauthLayout from '../layouts/superadmin/SuperAdminUnauthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'
import UnAuthLayout from '../layouts/UnAuthLayout'
//pages
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
import ShowUserProfile from '../pages/ShowUserProfile'
import SingleActivity from '../pages/SingleActivity'
import Mentions from '../pages/Mentions'
import ChatPage from '../pages/ChatPage'
import Saved from '../pages/Saved'
import SuggestionsPage from '../pages/SuggestionsPage'
import NotFoundPage from '../pages/NotFoundPage'
import SingleArticles from '../pages/SingleArticles'
import ForgotPassword from '../pages/ForgotPassword'
import SavedArticlesPage from '../pages/SavedArticlesPage'
import ProfileTabLayout from '../layouts/ProfileTabLayout'
import Streaming from '../pages/Streaming'
import NewStreaming from '../pages/NewStreaming'
import SuperAdmin from '../pages/SuperAdmin'
import SuperAdminLogin from '../pages/SuperAdminLogin'
import AdminProtected from '../layouts/AdminProtected'

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<RootLayout />}>
			<Route path='/SuperAdmin' element={<SuperAdminLayout />}>
				<Route path='' element={<SuperAdminAuthLayout />}>
					<Route index element={<SuperAdmin />} />
				</Route>
				<Route path='Login' element={<SuperAdminUnauthLayout />}>
					<Route index element={<SuperAdminLogin />} />
				</Route>
			</Route>
			<Route path='/' element={<AuthLayout />}>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/' element={<ProfileTabLayout />}>
						<Route path='/' element={<Activities />} />
						<Route path='/Activities' element={<Activities />} />
						<Route path='/Mentions' element={<Mentions />} />
						<Route path='/Saved' element={<Saved />} />
						<Route path='/Suggestions' element={<SuggestionsPage />} />
						<Route path='/SavedArticles' element={<SavedArticlesPage />} />
						<Route path='/Connections' element={<Connections />} />
						<Route path='/Activities/:activityid' element={<SingleActivity />} />
						<Route path='/Discussions' element={<Discussions />} />
						<Route path='/Discussions/Create/New' element={<CreateDiscussion />} />
						<Route path='/Articles' element={<Articles />} />
						<Route path='/Articles/Create/New' element={<CreateArticle />} />
						<Route path='/Events' element={<Events />} />
						<Route
							path='/Events/Create/New'
							element={
								<AdminProtected>
									<CreateEvent />
								</AdminProtected>
							}
						/>
						<Route path='/Search' element={<UniversalSearchDetails />} />
					</Route>

					<Route path='/MyProfile' element={<MyProfile />} />
					<Route path='/ViewProfile/:userid' element={<ShowUserProfile />} />
					<Route path='/Discussions/:discussionid' element={<SingleDiscussion />} />
					<Route path='/Articles/:articleid' element={<SingleArticles />} />
					<Route path='/Events/:eventid' element={<SingleEvent />} />
					<Route path='/Events/:eventid/join' element={<NewStreaming />} />
					<Route
						path='/analytics'
						element={
							<AdminProtected>
								<Analytics />
							</AdminProtected>
						}
					/>

					<Route path='/Chat/:userid' element={<ChatPage />} />
				</Route>
			</Route>
			<Route path='/home' element={<Home />} />
			<Route path='ForgotPassword' element={<UnAuthLayout />}>
				<Route index element={<ForgotPassword />} />
			</Route>
			<Route path='login' element={<UnAuthLayout />}>
				<Route index element={<LogIn />} />
			</Route>
			<Route path='register' element={<UnAuthLayout />}>
				<Route index element={<Register />} />
			</Route>
			<Route path='welcome' element={<UnAuthLayout />}>
				<Route index element={<WelcomePage />} />
			</Route>
			<Route path='NotFound' element={<NotFoundPage />} />
			<Route path='*' element={<NotFoundPage />} />
		</Route>
	)
)
