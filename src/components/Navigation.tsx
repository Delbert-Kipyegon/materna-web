import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Calendar, Lightbulb, Sparkles, Crown, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../data/mockData';

const Navigation: React.FC = () => {
  const { language } = useAppStore();
  const t = translations[language];

  const navItems = [
    { to: '/', icon: Home, label: t.home },
    { to: '/ask', icon: MessageCircle, label: t.ask },
    { to: '/tracker', icon: Calendar, label: t.tracker },
    { to: '/tips', icon: Lightbulb, label: t.tips },
    { to: '/affirmations', icon: Sparkles, label: t.affirmations },
    { to: '/prime', icon: Crown, label: t.prime },
    { to: '/notes', icon: BookOpen, label: t.notes },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:block bg-white rounded-2xl shadow-sm border border-primary-100 p-6">
        <div className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50 shadow-sm border border-primary-200'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-25'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-primary-500 hover:bg-primary-25'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;