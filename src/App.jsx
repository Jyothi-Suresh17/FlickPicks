import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

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
  //for search optimization
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  //state for showing most trending stuff
  const [trendingMovies, setTrendingMovies] = useState([]);

  //Debouncing the search term to avoid making too many requests to the api when the user is typing in the search input
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

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
        throw new Error("An error occurred while fetching movies");
      }

      const data = await response.json();
      // console.log(data);

      //if fetching fails
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      //if fetching is successful
      setMovieList(data.results || []);
      if(query && data.results.length>0){
       await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`${error.message} occurred while fetching movies`);
      setErrorMessage("An error occurred while fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  //for trending

  const fetchTrendingMovies = async () => {
    try {
      const result = await getTrendingMovies();
      setTrendingMovies(result);
      
    } catch (error) {
      console.log(`Error occurred while fetching trending movies :${error.message}`);
    }
  }
//not to load everytime a user searches
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }
  , []);

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
            {/* when you pass setSearchTerm don't pass it down as a function because it will get called immediately after the search component gets rendered, so just pass the function declaration */}
          </header>
          {
            trendingMovies.length>0 && (
              <section className="trending">
                <h2 className=" ">Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie,index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          }
          <section className="all-movies">
            <h2 className=" ">All Movies</h2>
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