import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Initialize the Howl instance
    const newSound = new Howl({
      src: ['/src/songs/beatles-bundles_let-it-be-album-version-let-it-be-single-version.mp3'],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
    });

    setSound(newSound);

    // Cleanup function
    return () => {
      newSound.unload();
    };
  }, []);

  useEffect(() => {
    if (startTime === 1) {
      // Pause the music
      if (sound) {
        sound.pause();
      }
      
      // Set up the interval to play after 10 seconds
      const interval = setInterval(() => {
        if (sound) {
          sound.play();
        }
        setStartTime(0);
      }, 10000); // 10 seconds

      // Cleanup the interval
      return () => clearInterval(interval);
    }
  }, [startTime, sound]);

  const startTimer = () => {
    setStartTime(1);
  };

  const togglePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  return (
    <div className="music-player">
      <button 
        className="play-pause-button" 
        onClick={togglePlayPause}
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
      <button 
        className="stop-button" 
        onClick={startTimer}
        disabled={!isPlaying}
      >
        StartInterval
      </button>
    </div>
  );
};

export default MusicPlayer; 