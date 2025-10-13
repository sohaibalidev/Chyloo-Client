import { ServerOff, RefreshCw } from 'lucide-react';

export default function ServerDownScreen({ retry, isChecking }) {
  return (
    <div className='container'>
      <div className='status-card'>
        <ServerOff size={64} className='status-icon error' />
        <h1 className='status-title'>Server Unavailable</h1>
        <p className='status-description'>
          The server isn’t responding at the moment. Click “Check Server Status” to try waking it
          up.
        </p>
        <button onClick={retry} disabled={isChecking} className='retry-btn'>
          {isChecking ? (
            <>
              <RefreshCw size={20} className='spinning' />
              Checking Status...
            </>
          ) : (
            <>
              <RefreshCw size={20} />
              Check Server Status
            </>
          )}
        </button>
      </div>
    </div>
  );
}
