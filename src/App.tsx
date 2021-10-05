import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.scss';
import { getYelpResults } from './service/yelpService';
import {
  getGoogleRestaurantResults
} from './service/googleMapService';
import { Dropdown} from 'react-bootstrap';
import {GoogleBusiness, YelpBusiness} from './types';
import { joinDataSources } from './utilities';
import { SearchResultBody } from './components/SearchResultBody';
import {SearchBar} from "./components/SearchBar";

function App() {
  const [searchTerm, setSearchTerm] = useState("Restaurants");
  const [searchArea, setSearchArea] = useState(["San Francisco, CA"])
  const [searchResults, setSearchResults] = useState<Map<string, Array<YelpBusiness|GoogleBusiness>>>(new Map());
  const [latLongSelectedCity, setLatLong] = useState(["-122.4194", "37.7749"]);

  const callYelpAndGoogle = () => {
    Promise.all([
      getYelpResults(searchTerm, latLongSelectedCity[0], latLongSelectedCity[1]),
      getGoogleRestaurantResults(`${latLongSelectedCity[1]},${latLongSelectedCity[0]}`,searchTerm )
    ])
      .then((res) => joinDataSources(res))
      .then((mapResult) => setSearchResults(mapResult))
  }

  useEffect(() => {
    callYelpAndGoogle();
  }, [])

  const handleSearchResults = (searchResultFromButton: Map<string, Array<YelpBusiness|GoogleBusiness>>) => {
    setSearchResults(searchResultFromButton);
  }

  return (
    <div className="App">
      <header>
        <a href="https://www.intellimize.com/" target="_blank"
          rel="noopener noreferrer">
          <img src={logo} alt="logo" />
        </a>
      </header>
      <main className={"mainBody"}>
        <div>
          <SearchBar
            handleSearchResults={handleSearchResults}
            searchBoxTerm={searchTerm}
            searchAreaTerm={searchArea}
            latLong={latLongSelectedCity}
            setSearchAreaValues={setSearchArea}
            setLatLongValues={setLatLong}
            setSearchTermValues={setSearchTerm} />
          <h2>Showing {searchTerm} near {searchArea} </h2>
          <Dropdown.Divider />
          <SearchResultBody searchResults={searchResults}
            callDefaultSearch={callYelpAndGoogle}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
