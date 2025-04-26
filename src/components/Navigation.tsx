import { useLocation, Link } from 'react-router-dom';
import { Home, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/',
      label: 'Клик',
      icon: <Home className="w-6 h-6" />
    },
    {
      path: '/shop',
      label: 'Магазин',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      path: '/profile',
      label: 'Профиль',
      icon: <User className="w-6 h-6" />
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 z-10">
      <div className="flex justify-around items-center">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
