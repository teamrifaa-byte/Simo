import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
