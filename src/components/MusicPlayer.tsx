import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { songTimestamps } from '../data/songTimestamps';
import type { Timestamp } from '../data/songTimestamps';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<string>('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [showGlitter, setShowGlitter] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState(Array(20).fill(0));
  const [particles, setParticles] = useState(
    Array(6).fill(0).map((_, i) => ({ id: i, x: 0, y: 0, opacity: 0 }))
  );
  const [glitterParticles, setGlitterParticles] = useState(
    Array(80).fill(0).map((_, i) => ({
      id: i,
      x: 0,
      y: 0,
      opacity: 0,
      delay: 0,
      startX: 0,
      startY: 0,
    }))
  );
  const correctButtonRef = useRef<HTMLButtonElement>(null);

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

  // Update visualizer and particles
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerBars(prev => prev.map(() => Math.random() * 100));
        setParticles(prev =>
          prev.map(p => ({
            ...p,
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.random() * 0.6 + 0.2,
          }))
        );
      }, 150);
    } else {
      setVisualizerBars(prev => prev.map(() => Math.random() * 15));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Glitter animation
  useEffect(() => {
    if (showGlitter && correctButtonRef.current) {
      const buttonRect = correctButtonRef.current.getBoundingClientRect();
      const containerRect = document.querySelector('.music-player')?.getBoundingClientRect();

      if (containerRect) {
        const relativeX = ((buttonRect.left + buttonRect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const relativeY = ((buttonRect.top + buttonRect.height / 2 - containerRect.top) / containerRect.height) * 100;

        setGlitterParticles(prev =>
          prev.map(p => ({
            ...p,
            startX: relativeX + (Math.random() - 0.5) * 30,
            startY: relativeY + (Math.random() - 0.5) * 10,
            x: relativeX + (Math.random() - 0.5) * 30,
            y: relativeY,
            opacity: 1,
            delay: Math.random() * 100,
          }))
        );

        const interval = setInterval(() => {
          setGlitterParticles(prev =>
            prev.map(p => ({
              ...p,
              y: p.y - Math.random() * 2 - 1,
              x: p.startX + (Math.random() - 0.5) * 20,
              opacity: Math.max(0, p.opacity - 0.01),
            }))
          );
        }, 50);

        setTimeout(() => {
          setShowGlitter(false);
          clearInterval(interval);
        }, 4000);

        return () => clearInterval(interval);
      }
    }
  }, [showGlitter]);

  useEffect(() => {
    if (!sound) return;

    // Update current time every second
    const interval = setInterval(() => {
      if (isPlaying) {
        const time = sound.seek() as number;
        setCurrentTime(time);

        // Check if we've reached any timestamp
        const nextTimestamp = songTimestamps.find(
          (ts) => ts.timestamp > time && ts.timestamp <= time + 1
        );

        if (nextTimestamp) {
          sound.pause();
          setShowChoices(true);
          setCurrentChoices(nextTimestamp.choices);
          setCurrentCorrectAnswer(nextTimestamp.nextThreeWords);
          setSelectedAnswer(null);
          setIsFading(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const handleChoice = (choice: string) => {
    setSelectedAnswer(choice);
    setIsFading(true);

    if (choice === currentCorrectAnswer) {
      setShowGlitter(true);
    }

    // Wait for the fade animation to complete before resuming
    setTimeout(() => {
      if (sound) {
        sound.play();
        setShowChoices(false);
        setSelectedAnswer(null);
        setIsFading(false);
      }
    }, 1000);
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
      {/* Floating particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Glitter effect */}
      {showGlitter && (
        <div className="glitter-container">
          {glitterParticles.map((particle) => (
            <div
              key={particle.id}
              className="glitter-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}ms`,
                '--x': `${(Math.random() - 0.5) * 200}px`,
                '--y': `${-Math.random() * 200}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <h1 className="creative-heading">🎤 Finish the Line!</h1>
      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${Math.min((currentTime / (sound?.duration() || 1)) * 100, 100)}%` }}
        />
      </div>
      {/* Song title */}
      <div className="song-title">Beatles <span className="song-dash">–</span> <span className="song-name">Let it be</span></div>
      {/* Music visualizer */}
      <div className="visualizer">
        {visualizerBars.map((height, index) => (
          <div
            key={index}
            className="visualizer-bar"
            style={{
              height: `${Math.max(height, 10)}%`,
              opacity: isPlaying ? 0.9 : 0.4,
            }}
          />
        ))}
      </div>

      <button 
        className="play-pause-button" 
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <>
            <span>⏸️</span>
            <span>Pause</span>
          </>
        ) : (
          <>
            <span>▶️</span>
            <span>Play</span>
          </>
        )}
      </button>
      
      {showChoices && (
        <div className={`choices-section ${isFading ? 'fade-out' : ''}`}>
          <p>What are the next three words?</p>
          <div className="choices-container">
            {currentChoices.map((choice, index) => (
              <button 
                key={index}
                ref={choice === currentCorrectAnswer ? correctButtonRef : undefined}
                className={`choice-button ${
                  selectedAnswer === choice
                    ? choice === currentCorrectAnswer
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }`}
                onClick={() => handleChoice(choice)}
                disabled={selectedAnswer !== null}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer; 