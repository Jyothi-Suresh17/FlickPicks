import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //state to store the fetched data about movies
  const [movieList, setMovieList] = useState([]);
  //loading state as it takes time fetching data frm the api
  const [isLoading, setIsLoading] = useState(false);

  //function to fetch movies
  const fetchMovies = async (query = "") => {
    //setting loading before fetching
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("An error occured while fetching movies");
      }

      const data = await response.json();
      console.log(data);

      //if fetchig fails
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      //if fetching is successful
      setMovieList(data.results || []);
    } catch (error) {
      console.log(`${error.message} occured while fetching movies`);
      setErrorMessage("An error occured while fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="../public/hero-img.png" alt="" />
            <h1>
              Find the best <span className="text-gradient">movies</span> and{" "}
              <span className="text-gradient">series</span> here!
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {/* when you pass setSeachTerm don't pass it down as a function because it will get called immideatly after the search component gets rendered  ,so just pass the function decaration*/}
          </header>
          <section className="all-movies">
            <h2 className="mt-[40px] ">All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default App;
