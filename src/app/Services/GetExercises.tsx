import { API_URLS } from "../Consts/ApiUrls";
import Exercise from "../Models/Exercise";

const GetExercises = async () =>
{
    const response: Response = await fetch(API_URLS.GET_POST_EXERCISES);

    if (!response.ok)
    {
        throw new Error(`Http Error Status Code: ${response.status}`);
    }

    const data: {results: Exercise[]} = await response.json();

    if(data.results.length === 0)
    {
        throw new Error("No Results!!");
    }
    
    return data.results;
}

export default GetExercises;
