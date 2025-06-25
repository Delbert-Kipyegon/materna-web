import React from 'react';
import { Crown, Check, Zap, Shield, Download, Heart, Mic, Video } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import PrimeBadge from '../components/PrimeBadge';

const PrimePage: React.FC = () => {
  const primeFeatures = [
    {
      icon: Video,
      title: 'Video Chat with Maya',
      description: 'Face-to-face conversations with your AI maternal health assistant for personalized guidance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Personalized Nutrition Plan',
      description: 'Custom meal plans based on your pregnancy stage and dietary preferences',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Mic,
      title: 'Voice-to-Voice Chat',
      description: 'Natural conversations with your AI midwife, just like talking to a friend',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Emergency Toolkit',
      description: '24/7 access to emergency contacts, symptoms checker, and urgent care guides',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Downloadable Resources',
      description: 'Weekly tip sheets, milestone trackers, and personalized pregnancy journals',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: 'Advanced Pregnancy Planner',
      description: 'Comprehensive planning tools for birth, postpartum, and newborn care',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Crown,
      title: 'Custom Affirmations',
      description: 'Personalized daily affirmations based on your journey and challenges',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const includedFeatures = [
    'Unlimited AI questions',
    'Video chat with Maya (AI assistant)',
    'Voice responses for all content',
    'Detailed pregnancy milestones',
    'Personalized weekly insights',
    'Emergency support toolkit',
    'Custom nutrition recommendations',
    'Birth planning assistance',
    'Postpartum guidance',
    'Privacy-focused design',
    'Offline content access'
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6 lg:py-12">
        <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
          <Crown className="w-10 h-10 lg:w-16 lg:h-16 text-white" />
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold text-primary-900 mb-4">Materna Prime</h1>
        <p className="text-primary-600 text-lg lg:text-xl">Premium care for your pregnancy journey</p>
      </div>

      {/* Beta Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="p-6 lg:p-8 text-center">
          <div className="text-3xl lg:text-4xl mb-4">🎉</div>
          <h2 className="text-xl lg:text-2xl font-bold text-green-800 mb-3">All Prime Features Free During Beta!</h2>
          <p className="text-green-700 lg:text-lg">
            Experience the full power of Materna AI at no cost while we perfect your experience.
          </p>
        </div>
      </Card>

      {/* Prime Features */}
      <div className="space-y-6">
        <h2 className="text-xl lg:text-2xl font-bold text-primary-900 text-center mb-6">Premium Features</h2>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
          {primeFeatures.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="p-6 lg:p-8 flex items-start space-x-4">
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="font-semibold text-primary-900 lg:text-lg">{feature.title}</h3>
                    <PrimeBadge size="sm" />
                  </div>
                  <p className="text-sm lg:text-base text-primary-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <Card>
        <div className="p-6 lg:p-8">
          <h3 className="font-semibold text-primary-900 mb-6 lg:text-lg flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            What's Included
          </h3>
          <div className="grid lg:grid-cols-2 gap-4">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-primary-700 text-sm lg:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Pricing Section */}
      <Card className="bg-gradient-to-br from-primary-50 to-coral-50 border-primary-200">
        <div className="p-6 lg:p-8">
          <h3 className="font-semibold text-primary-900 mb-6 text-center lg:text-lg">Future Pricing</h3>
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-8">
            <div className="text-center p-4 lg:p-6 bg-white rounded-xl border border-primary-200">
              <div className="text-2xl lg:text-3xl font-bold text-primary-600 mb-2">$2.49</div>
              <div className="text-sm lg:text-base text-primary-500">Monthly</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-white rounded-xl border border-primary-200 relative">
              <div className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs px-2 py-1 rounded-full">
                Save 33%
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-coral-600 mb-2">$19.99</div>
              <div className="text-sm lg:text-base text-coral-500">Yearly</div>
            </div>
          </div>
          
          <Button 
            className="w-full opacity-75 cursor-not-allowed lg:text-lg lg:py-4"
            disabled
          >
            Currently Free - No Payment Required
          </Button>
          
          <p className="text-xs lg:text-sm text-center text-primary-500 mt-4">
            Pricing will take effect after beta period ends
          </p>
        </div>
      </Card>

      {/* Testimonial */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <div className="p-6 lg:p-8">
          <div className="text-center">
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-lg lg:text-xl">⭐</span>
              ))}
            </div>
            <blockquote className="text-primary-800 italic mb-4 lg:text-lg leading-relaxed">
              "Materna AI gave me confidence throughout my pregnancy. The video chat with Maya felt like talking to a real friend who understood exactly what I was going through."
            </blockquote>
            <cite className="text-sm lg:text-base text-primary-600">— Sarah M., New Mom from Nairobi</cite>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrimePage;