import Sidebar from './Sidebar';
import NotificationToasts from './NotificationToasts';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
      <Sidebar />
      <NotificationToasts />
      <main className="ml-64 p-8 max-md:ml-0 max-md:pt-24 max-md:pb-24 max-md:px-4">
        {children}
      </main>
    </div>
  );
}