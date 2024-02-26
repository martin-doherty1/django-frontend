"use client";
import React, {useState} from 'react';
import searchExercises from '@/app/Services/ElasticSearches';
import DebouncedValue from '@/app/Utils/DebouncedValue';
import { useQuery } from 'react-query';
import Exercise from '@/app/Models/Exercise';

const Search = () =>
{
    const [searchTerm, setSearchTerm] = useState<string>("");

    const debouncedSearchTerm = DebouncedValue(searchTerm, 500);

    const {data: exerciseResults, error } = useQuery<Exercise[], Error>(
        ['exercises', debouncedSearchTerm],
        () => searchExercises(debouncedSearchTerm),
        {
            enabled: debouncedSearchTerm.length > 0,
            retry: (_failureCount, error) => error.message !== "No Results!!"
        }
    );

    return(
        <>
            <div className='m-5'>
                <input type='text' className='border-4 rounded-full border-sky-500 pl-1' placeholder='Search Exercises' value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />

                <br/>
                <br/>
                { (!debouncedSearchTerm && !error) && <h1 className='text-lime-400 underline uppercase text-xl'>Please Enter Search Term</h1> }
                <br/>
                { (error && debouncedSearchTerm) && <h1 className='text-rose-600 underline uppercase text-xl'>{error.message}</h1> }

                <div className='flex flex-row flex-wrap justify-evenly'>
                    {exerciseResults && exerciseResults.map((exercise, index) => (
                        <React.Fragment key={index}>
                            <div className="border-4 rounded-full border-sky-500 m-10 p-5 w-1/5">
                            <p className="text-center">{exercise.exercise_name}</p>
                            <p className="text-center">{exercise.description}</p>
                            <p className="text-center">{exercise.body_part}</p>
                            </div>
                            <br/>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Search;