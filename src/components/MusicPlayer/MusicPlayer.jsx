// src/components/MusicPlayer/MusicPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

// 🎵 Playlist — all songs play one after another automatically
const PLAYLIST = [
  { title: 'Gopal Song',        artist: 'Original Track',  src: '/assets/songs/gopal_song.mpeg' },
  { title: 'Different Throne',  artist: 'Original Track',  src: '/assets/songs/Different_Throne.mp3' },
  { title: "Makin' My Own Glory", artist: 'Original Track', src: '/assets/songs/Makin_My_Own_Glory.mp3' },
];

export default function MusicPlayer() {
  const [expanded, setExpanded]   = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [volume, setVolume]       = useState(0.4);
  const [trackIdx, setTrackIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[trackIdx];

  // Load new track whenever trackIdx changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playing) audio.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Auto-advance to next song when current ends
  const handleEnded = () => {
    const next = (trackIdx + 1) % PLAYLIST.length;
    setTrackIdx(next);
    setPlaying(true);
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const prevTrack = () => {
    setTrackIdx((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const nextTrack = () => {
    setTrackIdx((i) => (i + 1) % PLAYLIST.length);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = parseFloat(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  };

  return (
    <div className={`music-player ${expanded ? 'music-player--expanded' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        preload="auto"
      />

      {/* Floating toggle button */}
      <button
        className="music-player__toggle"
        onClick={() => setExpanded((e) => !e)}
        aria-label="Toggle music player"
      >
        <span className={`music-player__note ${playing ? 'music-player__note--pulse' : ''}`}>🎵</span>
      </button>

      {/* Expanded panel */}
      <div className="music-player__panel">
        <button
          className="music-player__close"
          onClick={() => setExpanded(false)}
          aria-label="Close music player"
        >
          &times;
        </button>

        {/* Vinyl / Album art */}
        <div className="music-player__art">
          <div className={`music-player__vinyl ${playing ? 'music-player__vinyl--spin' : ''}`}>🎵</div>
        </div>

        {/* Track info */}
        <div className="music-player__info">
          <p className="music-player__track">{currentTrack.title}</p>
          <p className="music-player__artist">{currentTrack.artist}</p>
          {/* Track counter: e.g. 1 / 3 */}
          <p className="music-player__counter">{trackIdx + 1} / {PLAYLIST.length}</p>
        </div>

        {/* Visualizer bars */}
        <div className={`music-player__viz ${playing ? 'music-player__viz--active' : ''}`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="music-player__bar" style={{ '--delay': `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="music-player__progress"
          aria-label="Seek"
        />

        {/* Controls: Prev | Play/Pause | Next */}
        <div className="music-player__controls">
          <button className="music-player__skip" onClick={prevTrack} aria-label="Previous">⏮</button>

          <button
            className={`music-player__play ${playing ? 'music-player__play--active' : ''}`}
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>

          <button className="music-player__skip" onClick={nextTrack} aria-label="Next">⏭</button>
        </div>

        {/* Volume */}
        <div className="music-player__volume-wrap">
          🔈
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className="music-player__volume"
            aria-label="Volume"
          />
          🔊
        </div>
      </div>
    </div>
  );
}
