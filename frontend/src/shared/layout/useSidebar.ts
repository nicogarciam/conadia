import { useState, useEffect } from 'react';

export function useSidebar() {
  const [sidebarShow, setSidebarShow] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarShow(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { sidebarShow, setSidebarShow };
}
