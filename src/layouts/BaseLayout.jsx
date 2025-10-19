import Sidebar from '@/components/Sidebar';

export default function BaseLayout({ children }) {
  return (
    <div className='app-shell'>
      <Sidebar />
      <div className='app-content'>{children}</div>
    </div>
  );
}
