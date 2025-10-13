import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import NewPost from '@/pages/NewPost';

const baseRoutes = [
  { path: '', element: <Home />, isPrivate: true },
  { path: 'search', element: <Search />, isPrivate: true },
  { path: 'posts/new', element: <NewPost />, isPrivate: true },
  { path: 'profile/:username', element: <Profile />, isPrivate: true },
  { path: 'settings', element: <div>Settings</div>, isPrivate: true },
  { path: 'messages', element: <div>Messages</div>, isPrivate: true },
  { path: 'notifications', element: <div>Notifications</div>, isPrivate: true },
];

export default baseRoutes;
