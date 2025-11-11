import React, { useState } from "react"

const JERSEYS = [
  {
    id: 1,
    player: "Isiah Thomas",
    team: "Detroit Pistons",
    year: 1988,
    imageURL: "https://images.footballfanatics.com/detroit-pistons/isiah-thomas-detroit-pistons-1988-89-blue-swingman-player-jersey_ss5_p-200105587+u-dky09shkpoj82ror4hti+v-ikrgcoo9trr6aiwo6jvu.jpg?_hv=2&w=400"
  },
  {
    id: 2,
    player: "Larry Bird",
    team: "Boston Celtics",
    year: 1985,
    imageURL: "https://images.footballfanatics.com/boston-celtics/mens-larry-bird-kelly-green-boston-celtics-1985/86-hardwood-classics-swingman-player-jersey_ss5_p-200105500+u-xis5jmq1vcpqr94lbjli+v-ez2qiho9l88lst8u6x94.jpg?_hv=2&w=400"
  },
  {
    id: 3,
    player: "Magic Johnson",
    team: "Los Angeles Lakers",
    year: 1984,
    imageURL: "https://images.footballfanatics.com/los-angeles-lakers/magic-johnson-los-angeles-lakers-1984-85-gold-swingman-player-jersey_ss5_p-200105793+u-uj00bczdo29srvv0gneq+v-0u4stfrnfx3ontz6xlcx.jpg?_hv=2&w=400"
  },
  {
    id: 4,
    player: "Kevin Garnett",
    team: "Minnesota Timberwolves",
    year: 1995,
    imageURL: "https://images.footballfanatics.com/minnesota-timberwolves/kevin-garnett-minnesota-timberwolves-1995-96-white-swingman-player-jersey_ss5_p-200105642+u-w9mmqwxt1ep4axpodoum+v-qgez61d8gyfrpptjc2xi.jpg?_hv=2&w=400"
  },
  {
    id: 5,
    player: "Tim Duncan",
    team: "San Antonio Spurs",
    year: 1998,
    imageURL: "https://images.footballfanatics.com/san-antonio-spurs/tim-duncan-san-antonio-spurs-1998-99-black-swingman-player-jersey_ss5_p-200105769+u-j99gvkq0kmldhjfeg1rx+v-gwwpjdzsnsvsxlhjivmm.jpg?_hv=2&w=400"
  },
]

export default function JerseySelector(){
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const currentJersey = JERSEYS[currentIndex];

  const goLeft = () => {
    setCurrentIndex((prev) =>
      prev === 0? JERSEYS.length - 1 : prev - 1
    );
  };

  const goRight = () => {
    setCurrentIndex((prev) =>
      prev === JERSEYS.length - 1 ? 0 : prev + 1
    );
  };

  const toggleFavorite = () => {
    setFavorites((prev) => 
      prev.includes(currentJersey.id) ?
      prev.filter((id) => id !== currentJersey.id) :
      [...prev, currentJersey.id]
    );
  };

  const isFavorite = favorites.includes(currentJersey.id);
  const favoriteJerseys = JERSEYS.filter((j) => favorites.includes(j.id));

  return (
    <div className="app">
      <h1 className="title">Throwback Jersey Selector</h1>
      <div className="main-layout">
        <div className="jersey-view">
          <div className="jersey-image-wrapper">
            <img
              src={currentJersey.imageURL}
              alt={`${currentJersey.player} Throwback Jersey`}
              className="jersey-image"
            />
            
            <div className="buttons-row">
              <button onClick={goLeft}>Left</button>
              <button
                onClick={toggleFavorite}
                className={isFavorite ? "favorite active" : "favorite"}
              >
                {isFavorite ? "★ Favorited" : "☆ Favorite"}
              </button>
              <button onClick={goRight}>Right</button>
            </div>
          </div>
          
          <div className="jersey-info">
            <h2>{currentJersey.player}</h2>
            <p><strong>Team:</strong> {currentJersey.team}</p>
            <p><strong>Year:</strong> {currentJersey.year}</p>
          </div>

          <div className="favorite-panel">
            <h3>Your Favorites</h3>
            {favoriteJerseys.length === 0 ? (
              <p>No favorites yet. Hit "Favorite" to start your stash.</p>
            ) : (
              <ul>
                {favoriteJerseys.map((jersey) => (
                  <li key = {jersey.id}>
                    {jersey.player} ({jersey.team}, {jersey.year})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );

/*
  return(
    <div style = {{padding: '2rem'}}>
      <h1>Jersey Selector Builder</h1>
      <p>This is the Jersey Selector Project - Frontend.</p>
      {}
    </div>
  )
*/
}