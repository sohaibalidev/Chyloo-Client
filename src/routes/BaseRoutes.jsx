import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import NewPost from '@/pages/NewPost';
import Messages from '@/pages/Messages';
import Notification from '@/pages/Notification';
import Settings from '@/pages/Settings';

const baseRoutes = [
  { path: '', element: <Home />, isPrivate: true },
  { path: 'search', element: <Search />, isPrivate: true },
  { path: 'posts/new', element: <NewPost />, isPrivate: true },
  { path: 'messages', element: <Messages />, isPrivate: true },
  { path: 'profile/:username', element: <Profile />, isPrivate: true },
  { path: 'settings', element: <Settings />, isPrivate: true },
  { path: 'notifications', element: <Notification />, isPrivate: true },
];

export default baseRoutes;
