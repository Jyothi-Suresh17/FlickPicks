import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;


// Create a new client instance
const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1') 
.setProject(PROJECT_ID) // Your Appwrite Project ID

// Create a new database instance
const database = new Databases(client);

export const updateSearchCount = async(serachTerm , movie)=>{
  // console.log(DATABASE_ID, COLLECTION_ID, PROJECT_ID);

  //1.use appwrite SDK to check if the search term already exists in the database
    try {
      const result= await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', serachTerm)]);
  //2.if it does, increment the count

      if(result.documents.length>0){
        //increment the count
        const doc = result.documents[0];
        
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,{
          count: doc.count+1
        })}
        
  //3.if it doesn't, create a new entry with the search term and count as 1
        else{
          await database.createDocument(DATABASE_ID, COLLECTION_ID,ID.unique(), {
            searchTerm: serachTerm,
            count: 1,
            movie_id: movie.id,
            poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          })
        }

      
    } catch (error) {
      console.log(error);
      
      
    }


}

export const getTrendingMovies=async()=>{
  try {
    const result= await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5),Query.orderDesc('count')]);
    return result.documents;
    
  } catch (error) {
    console.log(error);
    
  }

}