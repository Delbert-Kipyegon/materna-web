import React, { useState } from 'react';
import { Volume2, Save, ThumbsUp, ThumbsDown, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { dailyTips } from '../data/mockData';
import Card from '../components/Card';
import Button from '../components/Button';
import PrimeBadge from '../components/PrimeBadge';

const TipsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNote } = useAppStore();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ [key: string]: 'helpful' | 'not-helpful' }>({});

  const currentTip = dailyTips[currentTipIndex];

  const handleFeedback = (tipId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [tipId]: type }));
  };

  const handleSaveTip = () => {
    addNote({
      content: `${currentTip.title}: ${currentTip.content}`,
      type: 'tip'
    });
  };

  const handleNewTip = () => {
    const nextIndex = (currentTipIndex + 1) % dailyTips.length;
    setCurrentTipIndex(nextIndex);
  };

  const playVoice = () => {
    alert('Voice playback would integrate with ElevenLabs API here');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'from-green-500 to-emerald-500',
      nutrition: 'from-orange-500 to-red-500',
      wellness: 'from-purple-500 to-pink-500',
      preparation: 'from-blue-500 to-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-md mx-auto px-4 space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Daily Tips</h1>
        <p className="text-primary-600">Helpful guidance for your pregnancy journey</p>
      </div>

      {/* Current Tip */}
      <Card isPrime={currentTip.isPrime}>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(currentTip.category)} text-white text-sm font-medium`}>
                  {currentTip.category}
                </div>
                {currentTip.isPrime && <PrimeBadge />}
              </div>
              <h2 className="text-xl font-bold text-primary-900 mb-3">
                {currentTip.title}
              </h2>
            </div>
          </div>
          
          <p className="text-primary-700 leading-relaxed">
            {currentTip.content}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-primary-100">
            <Button size="sm" variant="outline" onClick={playVoice} icon={Volume2}>
              Play Voice
            </Button>
            <Button size="sm" variant="outline" onClick={handleSaveTip} icon={Save}>
              Save Tip
            </Button>
            <Button size="sm" variant="outline" onClick={handleNewTip} icon={RefreshCw}>
              New Tip
            </Button>
          </div>

          {/* Feedback */}
          <div className="pt-4 border-t border-primary-100">
            <p className="text-sm text-primary-600 mb-3">Was this tip helpful?</p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={feedback[currentTip.id] === 'helpful' ? 'primary' : 'ghost'}
                onClick={() => handleFeedback(currentTip.id, 'helpful')}
                icon={ThumbsUp}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={feedback[currentTip.id] === 'not-helpful' ? 'primary' : 'ghost'}
                onClick={() => handleFeedback(currentTip.id, 'not-helpful')}
                icon={ThumbsDown}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Affirmations CTA */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <div className="p-6 text-center">
          <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-3" />
          <h3 className="font-semibold text-pink-900 mb-2">Need an Affirmation?</h3>
          <p className="text-pink-700 mb-4 text-sm">
            Get personalized affirmations to boost your confidence
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/affirmations')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Get Affirmation
          </Button>
        </div>
      </Card>

      {/* Tips Categories */}
      <Card>
        <div className="p-6">
          <h3 className="font-semibold text-primary-900 mb-4">Tip Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {['health', 'nutrition', 'wellness', 'preparation'].map((category) => (
              <div key={category} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg capitalize">
                    {category[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-primary-600 capitalize">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TipsPage;