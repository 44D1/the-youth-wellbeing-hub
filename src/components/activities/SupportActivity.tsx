
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MessageCircle, Globe, Heart } from 'lucide-react';

interface SupportActivityProps {
  onBack: () => void;
}

const SupportActivity: React.FC<SupportActivityProps> = ({ onBack }) => {
  const emergencyContacts = [
    {
      name: "Kids Helpline",
      phone: "1800 55 1800",
      description: "Free, confidential 24/7 phone and online counselling service for young people aged 5 to 25",
      website: "https://kidshelpline.com.au"
    },
    {
      name: "Lifeline",
      phone: "13 11 14",
      description: "24/7 crisis support and suicide prevention service",
      website: "https://lifeline.org.au"
    },
    {
      name: "Beyond Blue",
      phone: "1300 22 4636",
      description: "Support for anxiety, depression and suicide prevention",
      website: "https://beyondblue.org.au"
    }
  ];

  const onlineResources = [
    {
      name: "Headspace",
      description: "Mental health support for young people aged 12-25",
      website: "https://headspace.org.au"
    },
    {
      name: "ReachOut",
      description: "Online mental health resources for young people",
      website: "https://au.reachout.com"
    },
    {
      name: "Young Minds",
      description: "Mental health charity for children and young people",
      website: "https://youngminds.org.uk"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-slate-700">Support & Help</CardTitle>
            <p className="text-slate-600">
              You're not alone. Here are trusted resources for support and help.
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Helplines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-red-700">{contact.name}</h3>
                      <a 
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="text-red-600 font-bold hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{contact.description}</p>
                    <a 
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 text-sm hover:underline flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Online Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onlineResources.map((resource, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-700 mb-2">{resource.name}</h3>
                    <p className="text-slate-600 text-sm mb-2">{resource.description}</p>
                    <a 
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline flex items-center"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Visit Website
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">Remember</h3>
                <p className="text-slate-600">
                  Seeking help is a sign of strength, not weakness. Your feelings are valid, 
                  and there are people who care about you and want to help.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportActivity;
