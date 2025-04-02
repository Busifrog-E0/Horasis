// rrd
import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// layouts
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import RootLayout from '../layouts/RootLayout'
import SuperAdminAuthLayout from '../layouts/superadmin/SuperAdminAuthLayout'
import SuperAdminLayout from '../layouts/superadmin/SuperAdminLayout'
import SuperAdminUnauthLayout from '../layouts/superadmin/SuperAdminUnauthLayout'
import UnAuthLayout from '../layouts/UnAuthLayout'
//pages
import RouterErrorBoundary from '../components/Common/ErrorBoundaries/RouterErrorBoundary'
import WelcomePage from '../components/Login/WelcomePage'
import AdminProtected from '../layouts/AdminProtected'
import ProfileTabLayout from '../layouts/ProfileTabLayout'
import SuperAdminDashboardLayout from '../layouts/superadmin/SuperAdminDashboardLayout'
import Activities from '../pages/Activities'
import Analytics from '../pages/Analytics'
import Articles from '../pages/Articles'
import ChatPage from '../pages/ChatPage'
import Connections from '../pages/Connections'
import CreateArticle from '../pages/CreateArticle'
import CreateDiscussion from '../pages/CreateDiscussion'
import CreateEvent from '../pages/CreateEvent'
import CreatePodcast from '../pages/CreatePodcast'
import Discussions from '../pages/Discussions'
import EnterEvent from '../pages/EnterEvent'
import Events from '../pages/Events'
import ForgotPassword from '../pages/ForgotPassword'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import Mentions from '../pages/Mentions'
import MyProfile from '../pages/MyProfile'
import NewStreaming from '../pages/NewStreaming'
import NotFoundPage from '../pages/NotFoundPage'
import Podcasts from '../pages/Podcasts'
import Register from '../pages/Register'
import ReportsPage from '../pages/ReportsPage'
import Saved from '../pages/Saved'
import SavedArticlesPage from '../pages/SavedArticlesPage'
import ShowUserProfile from '../pages/ShowUserProfile'
import SingleActivity from '../pages/SingleActivity'
import SingleArticles from '../pages/SingleArticles'
import SingleDiscussion from '../pages/SingleDiscussion'
import SingleEvent from '../pages/SingleEvent'
import SinglePodcast from '../pages/SinglePodcast'
import SuggestionsPage from '../pages/SuggestionsPage'
import AdminTags from '../pages/superadmin/AdminTags'
import AdminUsers from '../pages/superadmin/AdminUsers'
import SuperAdminLogin from '../pages/SuperAdminLogin'
import Tags from '../pages/Tags'
import UniversalSearchDetails from '../pages/UniversalSearchDetails'


export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<RootLayout />} errorElement={<RouterErrorBoundary />}>
			<Route path='/SuperAdmin' element={<SuperAdminLayout />}>
				<Route path='' element={<SuperAdminAuthLayout />}>
					<Route path='' element={<SuperAdminDashboardLayout />}>
						<Route index element={<Navigate to='admin-users' />} />
						<Route path='admin-users' element={<AdminUsers />} />
						<Route path='tags' element={<AdminTags />} />
						
					</Route>
				</Route>
				<Route path='Login' element={<SuperAdminUnauthLayout />}>
					<Route index element={<SuperAdminLogin />} />
				</Route>
			</Route>
			<Route path='/' element={<AuthLayout />}>
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/' element={<ProfileTabLayout />}>
						<Route path='/' element={<Events />} />
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
							path='/TagsManager'
							element={
								<AdminProtected>
									<Tags />
								</AdminProtected>
							}
						/>
						<Route
							path='/Events/Create/New'
							element={
								<AdminProtected>
									<CreateEvent />
								</AdminProtected>
							}
						/>
						<Route path='/Search' element={<UniversalSearchDetails />} />

						<Route path='/Podcasts' element={<Podcasts />} />
						<Route path='/Podcasts/Create/New' element={<CreatePodcast />} />
						<Route path='/Podcasts/:podcastid' element={<SinglePodcast />} />
					</Route>

					<Route path='/MyProfile' element={<MyProfile />} />
					<Route path='/ViewProfile/:userid' element={<ShowUserProfile />} />
					<Route path='/Discussions/:discussionid' element={<SingleDiscussion />} />
					<Route path='/Articles/:articleid' element={<SingleArticles />} />
					<Route path='/Events/:eventid' element={<SingleEvent />} />
					<Route
						path='/analytics'
						element={
							<AdminProtected>
								<Analytics />
							</AdminProtected>
						}
					/>

					<Route
						path='/Reports'
						element={
							<AdminProtected>
								<ReportsPage />
							</AdminProtected>
						}
					/>

					<Route path='/Chat/:userid' element={<ChatPage />} />
				</Route>
				<Route path='/Events/:eventid/join' element={<NewStreaming />} />
			</Route>
			<Route path='/home' element={<Home />} />
			<Route path='EnterEvent' element={<Outlet />}>
				<Route index path=':DocumentID' element={<EnterEvent />} />
				<Route path='Events/:eventid/join' element={<NewStreaming />} />
			</Route>
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
