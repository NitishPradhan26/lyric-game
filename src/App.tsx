import './App.css'
import MusicPlayer from './components/MusicPlayer'

function App() {
  return (
    <>
      <div className="app-container">
        <h1><span role="img" aria-label="music">🎵</span> Guess the Lyrics</h1>
        <div style={{ height: '3.5rem' }} />
        <MusicPlayer />
      </div>
    </>
  )
}

export default App
