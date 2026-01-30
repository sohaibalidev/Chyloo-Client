import Home from '@/pages/Home';
import Search from '@/pages/Search';
import NewPost from '@/pages/NewPost';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Messages from '@/pages/Messages';
import NewStory from '@/pages/NewStory';
import Notification from '@/pages/Notification';

const baseRoutes = [
  { path: '', element: <Home />, isPrivate: true },
  { path: 'search', element: <Search />, isPrivate: true },
  { path: 'posts/new', element: <NewPost />, isPrivate: true },
  { path: 'messages', element: <Messages />, isPrivate: true },
  { path: 'messages/:conversationId', element: <Messages />, isPrivate: true },
  { path: 'stories/new', element: <NewStory />, isPrivate: true },
  { path: 'profile/:username', element: <Profile />, isPrivate: true },
  { path: 'settings', element: <Settings />, isPrivate: true },
  { path: 'notifications', element: <Notification />, isPrivate: true },
];

export default baseRoutes;
