import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 lg:py-8 text-sm lg:text-base text-gray-500 bg-white border-t border-primary-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2 lg:mb-0">
            <Heart className="w-4 h-4 text-coral-500" />
            <span>Built in Africa</span>
          </div>
          <div className="text-xs lg:text-sm">
            Built with <span className="font-semibold">Bolt.new</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;