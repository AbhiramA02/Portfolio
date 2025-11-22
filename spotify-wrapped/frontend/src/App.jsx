import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const BACKEND_BASE = "http://127.0.0.1:5000";

function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check User
        const meRes = await fetch(`${BACKEND_BASE}/api/me`, {
          credentials: "include",
        });

        if(meRes.status === 401){
          setLoading(false);
          return;
        }

        if(!meRes.ok){
          throw new Error("Failed to load profile");
        }

        const meData = await meRes.json();
        setProfile(meData);

        // 2. Fetch Top Artists
        const artistsResults = await fetch(`${BACKEND_BASE}/api/top-artists`, {
          credentials: "include",
        });
        if(artistsResults.ok){
          const artistsData = await artistsResults.json();
          setTopArtists(artistsData.items || []);
        }

        // 3. Fetch Top Tracks
        const tracksResults = await fetch(`${BACKEND_BASE}/api/top-tracks`, {
          credentials: "include",
        });
        if(tracksResults.ok){
          const tracksData = await tracksResults.json();
          setTopTracks(tracksData.items || []);
        }
      }catch(err){
        console.error(err);
        setError("Something went wrong talking to the backend.")
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogin = () => {
    window.location.href = `${BACKEND_BASE}/login`;
  };

  if(loading){
    return <div style={{padding: "2rem"}}>Loading...</div>;
  }

  if(!profile){
    return (
      <div style={{padding: "2rem", "textAlign": "center"}}>
        <h1>Spotify Wrapped - Last Month</h1>
        <p>Log in too see your top artists and tracks.</p>
        {error && <p style={{color: "red"}}>{error}</p>}
        <button onClick={handleLogin}>Log in to Spotify</button>
      </div>
    )
  }

  return (
    <div style={{padding: "2rem", maxWidth: "900px", margin: "0 auto"}}>
      <header style={{display: "flex", alignItems: "center", gap: "1rem"}}>
        {profile.images && profile.images[0] && (
          <img
            src={profile.images[0].url}
            alt="Profile"
            style={{width: 80, height: 80, borderRadius: "50%"}}
          />
        )}
        <div>
          <h1>Welcome, {profile.display_name}</h1>
          <p>
            Country: {profile.country} - Plan: {profile.product}
          </p>
          <p>
            Followers: {profile.followers?.total ?? 0} - Email: {profile.email}
          </p>
        </div>
      </header>

      <section style={{marginTop: "2rem"}}>
        <h2>Your Last Month's Top 5 Artists</h2>
        {topArtists.length === 0 ? (
          <p>No Top Artists Found.</p>
        ) : (
          <ol>
            {topArtists.map((artist) => (
              <li key={artist.id}>
                {artist.name}{" "}
                {artist.genres && artist.genres.length > 0 && (
                  <span>({artist.genres.slice(0, 2).join(", ")})</span>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section style={{marginTop: "2rem"}}>
        <h2>Your Last Month's Top 10 Tracks</h2>
        {topTracks.length === 0 ? (
          <p>No Top Tracks Found.</p>
        ) : (
          <ol>
            {topTracks.map((track) => (
              <li key={track.id}>
                {track.name} -{" "}
                {track.artists.map((a) => a.name).join(", ")} (
                  {track.album.name})
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

export default App
