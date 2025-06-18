
import { MoodType } from '@/components/MoodCheckIn';

export const getMoodMessage = (mood: MoodType): string => {
  const messages: Record<MoodType, string> = {
    'very-sad': "We understand this is a difficult time. These activities are designed to provide comfort and support.",
    'sad': "It's okay to feel this way. These gentle activities can help you navigate through your emotions.",
    'neutral': "You're in a balanced space. These activities can help you maintain or improve your wellbeing.",
    'happy': "It's wonderful to see you feeling good! Let's build on this positive energy.",
    'very-happy': "Your joy is beautiful! Here are some ways to celebrate and share your happiness."
  };

  return messages[mood] || '';
};

export const getMoodEmoji = (mood: MoodType): string => {
  const emojis: Record<MoodType, string> = {
    'very-sad': '😔',
    'sad': '🙁',
    'neutral': '😐',
    'happy': '🙂',
    'very-happy': '😄'
  };

  return emojis[mood] || '😐';
};
