import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center py-2 px-4",
      "text-sm font-medium transition-colors",
      isActive 
        ? "text-primary" 
        : "text-muted-foreground hover:text-primary"
    )}
  >
    <div className="mb-1">{icon}</div>
    <span>{label}</span>
  </Link>
);

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center py-1 z-10">
      <NavItem 
        to="/" 
        icon={<Home size={20} />} 
        label="Главная" 
        isActive={currentPath === '/'} 
      />
      <NavItem 
        to="/shop" 
        icon={<ShoppingBag size={20} />} 
        label="Магазин" 
        isActive={currentPath === '/shop'} 
      />
      <NavItem 
        to="/profile" 
        icon={<User size={20} />} 
        label="Профиль" 
        isActive={currentPath === '/profile'} 
      />
    </nav>
  );
};

export default Navigation;
