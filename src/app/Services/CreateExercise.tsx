import { error } from "console";
import { API_URLS } from "../Consts/ApiUrls";
import Exercise from "../Models/Exercise";

const createExercise = async (exercise: Exercise) =>
{
    const response: Response = await fetch(API_URLS.GET_POST_EXERCISES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exercise)
    });


    if(!response.ok)
    {
        throw new Error(`Error status: ${response.status}, Error `);
    }

    const data: {results: Exercise} = await response.json();

    console.log(data)
    await new Promise(f => setTimeout(f, 3000));
    return data.results;
}

export default createExercise;