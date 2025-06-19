
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Heart, Brain, Zap } from 'lucide-react';

interface MentalHealthResourcesProps {
  onBack: () => void;
}

const MentalHealthResources: React.FC<MentalHealthResourcesProps> = ({ onBack }) => {
  const resources = [
    {
      title: "Understanding Anxiety",
      description: "Learn about anxiety symptoms and healthy coping strategies",
      url: "https://www.beyondblue.org.au/mental-health/anxiety",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      category: "Anxiety"
    },
    {
      title: "Depression Support",
      description: "Information and resources for managing depression",
      url: "https://www.beyondblue.org.au/mental-health/depression",
      icon: <Heart className="w-6 h-6 text-red-500" />,
      category: "Depression"
    },
    {
      title: "Stress Management",
      description: "Practical tips for managing stress in daily life",
      url: "https://www.headspace.org.au/young-people/managing-stress/",
      icon: <Brain className="w-6 h-6 text-blue-500" />,
      category: "Stress"
    },
    {
      title: "Kids Helpline",
      description: "Free, private and confidential 24/7 phone and online counselling",
      url: "https://kidshelpline.com.au/",
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      category: "Support"
    },
    {
      title: "ReachOut",
      description: "Mental health resources and tools for young people",
      url: "https://au.reachout.com/",
      icon: <Brain className="w-6 h-6 text-green-500" />,
      category: "General"
    },
    {
      title: "Headspace Youth Mental Health",
      description: "Mental health support specifically for young people",
      url: "https://www.headspace.org.au/",
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      category: "Youth Support"
    }
  ];

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-slate-700 mb-2 flex items-center justify-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              Mental Health Resources
            </h1>
            <p className="text-slate-600">Helpful resources and support for your wellbeing journey</p>
          </div>
        </div>

        {/* Emergency Notice */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-700 font-medium mb-2">
                🚨 If you're in immediate danger or having thoughts of self-harm
              </p>
              <p className="text-red-600 text-sm mb-3">
                Call <strong>000</strong> for emergency services or <strong>13 11 14</strong> for Lifeline
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-white/50 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleResourceClick(resource.url)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {resource.icon}
                    <div>
                      <CardTitle className="text-lg text-slate-700">
                        {resource.title}
                      </CardTitle>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {resource.category}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  {resource.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Support */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Remember: You're Not Alone
              </h3>
              <p className="text-slate-600 text-sm">
                These resources are here to support you. If you need immediate help, 
                don't hesitate to reach out to a trusted adult, counselor, or helpline.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentalHealthResources;
