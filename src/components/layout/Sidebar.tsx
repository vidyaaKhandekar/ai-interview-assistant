
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  History, 
  Home, 
  HelpCircle,
  Video
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Generate Questions', 
      path: '/generate-questions', 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    { 
      name: 'Schedule Interview', 
      path: '/schedule-interview', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Interview Session', 
      path: '/interview-session', 
      icon: <Video className="h-5 w-5" /> 
    },
    { 
      name: 'Interview Reports', 
      path: '/interview-reports', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Interview History', 
      path: '/interview-history', 
      icon: <History className="h-5 w-5" /> 
    }
  ];

  return (
    <div className="bg-sidebar w-64 min-h-screen shadow-lg flex-shrink-0 hidden md:block">
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-white">Interview AI</h2>
      </div>
      <nav className="mt-6 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70 text-center">
          Powered by AI Technology
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
