
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, ExternalLink, RefreshCw } from 'lucide-react';

interface PlaylistActivityProps {
  onBack: () => void;
}

const PlaylistActivity: React.FC<PlaylistActivityProps> = ({ onBack }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);

  const happyPlaylists = [
    {
      id: '37i9dQZF1DXdPec7aLTmlC',
      name: 'Happy Hits!',
      description: 'The best happy songs to brighten your day',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'
    },
    {
      id: '37i9dQZF1DX0XUsuxWHRQd',
      name: 'RapCaviar',
      description: 'New music and big hits in hip-hop',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd'
    },
    {
      id: '37i9dQZF1DX1lVhptIYRda',
      name: 'Hot Country',
      description: 'The hottest 50 in country music',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda'
    },
    {
      id: '37i9dQZF1DWXRqgorJj26U',
      name: 'Rock Classics',
      description: 'Rock legends & epic songs',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U'
    },
    {
      id: '37i9dQZF1DX4JAvHpjipBk',
      name: 'New Music Friday',
      description: 'The best new music in one playlist',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX4JAvHpjipBk'
    },
    {
      id: '37i9dQZF1DX4SBhb3fqCJd',
      name: 'Anti Pop',
      description: 'The edge of pop music',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX4SBhb3fqCJd'
    },
    {
      id: '37i9dQZF1DWWQRwui0ExPn',
      name: 'Lorem',
      description: 'A vibrant mix of Latin hits',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn'
    },
    {
      id: '37i9dQZF1DX3rxVfibe1L0',
      name: 'Mood Booster',
      description: 'Get happy with these energizing favorites',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0'
    },
    {
      id: '37i9dQZF1DXc5V2Ggs4TFN',
      name: 'Feel Good Friday',
      description: 'Good vibes for good times',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXc5V2Ggs4TFN'
    },
    {
      id: '37i9dQZF1DX6GwdWRQMQpq',
      name: 'Singing in the Car',
      description: 'Belt it out with these sing-along favorites',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX6GwdWRQMQpq'
    }
  ];

  const getRandomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * happyPlaylists.length);
    const playlist = happyPlaylists[randomIndex];
    setCurrentPlaylist(playlist);
    return playlist;
  };

  const openSpotifyPlaylist = (playlist: any) => {
    window.open(playlist.url, '_blank');
  };

  const generateAndOpen = () => {
    const playlist = getRandomPlaylist();
    setTimeout(() => {
      openSpotifyPlaylist(playlist);
    }, 1000); // Small delay to show the selected playlist
  };

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

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-green-500 mr-2" />
              <CardTitle className="text-2xl text-slate-700">Uplifting Playlist</CardTitle>
            </div>
            <p className="text-slate-600">
              Listen to music that matches your amazing energy and makes you feel even better!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Music className="w-24 h-24 text-white" />
              </div>

              {currentPlaylist && (
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    🎵 {currentPlaylist.name}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {currentPlaylist.description}
                  </p>
                  <Button
                    onClick={() => openSpotifyPlaylist(currentPlaylist)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Spotify
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={generateAndOpen}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-3"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Get Random Happy Playlist
                </Button>

                {currentPlaylist && (
                  <Button
                    onClick={getRandomPlaylist}
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Another Playlist
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-4">🎶 Music & Mood Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-600">
                <ul className="space-y-2">
                  <li>• Boosts endorphin production</li>
                  <li>• Reduces stress and anxiety</li>
                  <li>• Enhances mood and energy</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Improves focus and motivation</li>
                  <li>• Connects you with positive emotions</li>
                  <li>• Creates lasting happy memories</li>
                </ul>
              </div>
            </div>

            <div className="text-center text-sm text-slate-500">
              <p>Note: You'll need a Spotify account to access the playlists.</p>
              <p>If you don't have Spotify, you can sign up for free at spotify.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaylistActivity;
