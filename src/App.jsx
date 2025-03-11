import React, { useState,useEffect } from 'react'
import Search from './components/Search'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL= 'https://api.themoviedb.org/3';
  const API_KEY= import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    
  }, []);
  

  return (
    <>
    <main>
      <div className='pattern'/>
      <div className="wrapper">
        <header>
          <img src="../public/hero-img.png" alt="" />
          <h1>
            Find the best <span className='text-gradient'>movies</span> and <span className='text-gradient'>series</span> here!
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* when you pass setSeachTerm don't pass it down as a function because it will get called immideatly after the search component gets rendered  ,so just pass the function decaration*/}
      </div>
    </main>
    
    
    </>
  )
}

export default App