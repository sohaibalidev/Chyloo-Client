import { WifiOff } from 'lucide-react';

export default function OfflineScreen() {
  return (
    <div className='container'>
      <div className='status-card'>
        <WifiOff size={64} className='status-icon error' />
        <h1 className='status-title'>No Internet Connection</h1>
        <p className='status-description'>Please check your network connection and try again.</p>
      </div>
    </div>
  );
}
