import { useState } from 'react';
import Dashboard from './Dashboard';
import WorkerEntry from './WorkerEntry';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'entry'>(
    'dashboard'
  );

  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard onNavigateToEntry={() => setCurrentPage('entry')} />
      )}
      {currentPage === 'entry' && (
        <WorkerEntry onNavigateToDashboard={() => setCurrentPage('dashboard')} />
      )}
    </>
  );
}

export default App;
