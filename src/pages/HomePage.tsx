import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, Lightbulb, Crown, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = translations[language];

  const quickActions = [
    {
      icon: MessageCircle,
      title: t.askQuestion,
      description: 'Get instant AI-powered answers to your pregnancy questions',
      path: '/ask',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Calendar,
      title: t.pregnancyTracker,
      description: 'Track your pregnancy milestones and baby\'s development',
      path: '/tracker',
      color: 'from-coral-500 to-coral-600'
    },
    {
      icon: Lightbulb,
      title: t.dailyTip,
      description: 'Discover daily tips for a healthy pregnancy journey',
      path: '/tips',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const secondaryActions = [
    {
      icon: Sparkles,
      title: t.affirmations,
      description: 'Daily affirmations for confidence',
      path: '/affirmations',
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: BookOpen,
      title: t.notes,
      description: 'Your saved tips and thoughts',
      path: '/notes',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Section */}
      <div className="text-center py-8 lg:py-16">
        <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-coral-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl lg:text-4xl font-bold">M</span>
        </div>
        <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-primary-900 mb-4 lg:mb-6">
          {t.welcome}
        </h1>
        <p className="text-lg lg:text-xl xl:text-2xl text-primary-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Quick Actions - Desktop Grid */}
      <div className="lg:hidden space-y-4">
        {quickActions.map((action) => (
          <Card key={action.path} onClick={() => navigate(action.path)}>
            <div className="p-6 flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900 mb-1">{action.title}</h3>
                <p className="text-sm text-primary-600">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Primary Actions */}
        <div className="grid lg:grid-cols-3 gap-6 xl:gap-8 mb-8">
          {quickActions.map((action) => (
            <Card key={action.path} onClick={() => navigate(action.path)} className="group">
              <div className="p-8 text-center space-y-6">
                <div className={`w-16 h-16 xl:w-20 xl:h-20 mx-auto rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl xl:text-2xl font-bold text-primary-900 mb-3">{action.title}</h3>
                  <p className="text-primary-600 leading-relaxed">{action.description}</p>
                </div>
                <Button variant="outline" className="group-hover:bg-primary-50">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="grid lg:grid-cols-2 gap-6 xl:gap-8 mb-8">
          {secondaryActions.map((action) => (
            <Card key={action.path} onClick={() => navigate(action.path)} className="group">
              <div className="p-6 flex items-center space-x-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">{action.title}</h3>
                  <p className="text-primary-600">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Prime CTA */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="p-6 lg:p-8 text-center lg:flex lg:items-center lg:text-left lg:space-x-8">
          <div className="flex-1">
            <div className="flex items-center justify-center lg:justify-start mb-3">
              <Crown className="w-8 h-8 text-yellow-600 mr-2" />
              <span className="text-xl lg:text-2xl font-bold text-yellow-800">Materna Prime</span>
            </div>
            <p className="text-yellow-700 mb-4 lg:mb-0 lg:text-lg">
              Unlock personalized nutrition plans, emergency toolkit, and premium features
            </p>
          </div>
          <div className="lg:flex-shrink-0">
            <Button
              variant="secondary"
              onClick={() => navigate('/prime')}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 lg:px-8"
            >
              {t.tryPrime}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid - Mobile Only */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">10k+</div>
            <div className="text-sm text-primary-500">Mothers Helped</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-coral-600 mb-1">24/7</div>
            <div className="text-sm text-coral-500">AI Support</div>
          </div>
        </Card>
      </div>

      {/* Desktop Features Overview */}
      <div className="hidden lg:block">
        <div className="text-center mb-8">
          <h2 className="text-2xl xl:text-3xl font-bold text-primary-900 mb-4">Why Choose Materna AI?</h2>
          <p className="text-primary-600 text-lg max-w-3xl mx-auto">
            Trusted by thousands of mothers across Africa and beyond, providing personalized care every step of your journey.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-primary-900 mb-2">AI-Powered Answers</h3>
            <p className="text-sm text-primary-600">Get instant, personalized responses to all your pregnancy questions</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-primary-900 mb-2">Week-by-Week Tracking</h3>
            <p className="text-sm text-primary-600">Monitor your baby's development with detailed milestone tracking</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-primary-900 mb-2">Daily Support</h3>
            <p className="text-sm text-primary-600">Receive daily tips and affirmations tailored to your journey</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-primary-900 mb-2">Premium Care</h3>
            <p className="text-sm text-primary-600">Access advanced features with Materna Prime membership</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;