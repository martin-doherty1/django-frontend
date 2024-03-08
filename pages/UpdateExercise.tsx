import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Exercise from "@/app/Models/Exercise";
import Loading from "@/app/Components/Loading";
import convertType from "@/app/Utils/ConvertShortHandToLongHand";
import { GetExerciseById } from "@/app/Services/GetExercises";
import { changeExercise, deleteExerciseById } from "@/app/Services/CreateExercise";
import { queryClient } from "./_app";
import Navbar from "@/app/Components/NavigationBar";

const UpdateExercise = () =>
{
    const [updateExercise, setUpdateExercise] = useState<Exercise | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
    const [sameExercise, setSameExercise] = useState<boolean>(false);

    const router = useRouter();
    const { exerciseId } = router.query as {exerciseId: string};

    const {data: originalExercise, error} = useQuery<Exercise, Error>(
        ['exercises'],
        () => GetExerciseById(exerciseId),
        {
          retry: (_failureCount, error) => error.message !=="No Results!!",
          enabled: exerciseId !== undefined
        }
      );
    
      useEffect(() => {
        setUpdateExercise(originalExercise!);
      }, [originalExercise]);

    const updateExerciseMutation = useMutation(() => changeExercise(updateExercise!, exerciseId),
    {
        onSuccess: () => {
            setUpdateSuccess(true);
        },
        onError: (err:Error) => {
            console.error(`Error Creating Exercise: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries('update');
        }
    })

    const deleteExerciseMutation = useMutation(() => deleteExerciseById(exerciseId),
    {
        onError: (err:Error) => {
            console.error(`Error Deleting Exercise: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries('update');
        }
    })

    

    if (updateExerciseMutation.isLoading) {
        return (
            <Loading/>
        )
    }

    if (updateExerciseMutation.isError) {
        return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Error Updating Exercise</h1>
                <p className="text-gray-600 mb-6"></p>
                <Link href="/"  className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Go
                back to Home Page</Link>
            </div>
        </div>
        )
    }

    if(deleteExerciseMutation.isSuccess) {
        return (
            <div className="bg-gray-100 h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8">Deleted Successfully</h1>
                    <a href="/" className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Go
                        back to Home Screen</a>
                </div>
            </div>
        )
    }

    if (deleteExerciseMutation.isLoading) {
        return (
            <Loading/>
        )
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => 
    {
        event.preventDefault();
        if(updateExercise == originalExercise)
        {
            setSameExercise(true);
            return;
        }

        updateExerciseMutation.mutate();
    }

    const handleDelete = () =>
    {
        
        deleteExerciseMutation.mutate();
    }

    return(
    <>
        <title>Update Exercise</title>
        <Navbar/>
        {updateSuccess ? (
            <div className="bg-gray-100 h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8">Updated Successfully</h1>
                    <p className="text-gray-600 mb-6">Exercise Name: {updateExercise!.exercise_name}</p>
                    <p className="text-gray-600 mb-6">Exercise Description: {updateExercise!.description}</p>
                    <p className="text-gray-600 mb-6">Eercise Body Part: {updateExercise!.body_part}</p>
                    <p className="text-gray-600 mb-6">Exercise Type: {convertType(updateExercise!.type!)}</p>
                    <a href="/" className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Go
                        back to Home Screen</a>
                </div>
            </div>
        ) : (
            <>
            <div className="bg-white border border-4 rounded-lg shadow relative m-10">

                <div className="flex items-start justify-between p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold">
                        Update Exercise
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <form id='update-exercise' onSubmit={handleSubmit}>
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="exercise-name" className="text-sm font-medium text-gray-900 block mb-2">Exercise Name</label>
                                <input type='text' placeholder='Exercise Name' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required  id="exercise-name" maxLength={50} value={updateExercise?.exercise_name ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateExercise({ ...updateExercise, exercise_name: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="description" className="text-sm font-medium text-gray-900 block mb-2">Description</label>
                                <input type='text' placeholder='Description' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required  id="description" maxLength={300} value={updateExercise?.description ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateExercise({ ...updateExercise, description: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="body-part" className="text-sm font-medium text-gray-900 block mb-2">Body Part</label>
                                <input type='text' placeholder='Body Part' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required id="body-part" maxLength={5} value={updateExercise?.body_part ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateExercise({ ...updateExercise, body_part: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="type" className="text-sm font-medium text-gray-900 block mb-2">Exercise Type</label>
                                <select id="type" required className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUpdateExercise({ ...updateExercise, type: e.target.value})} value={updateExercise?.type ?? ''}>
                                    <option disabled value="">-- Select an option --</option>
                                    <option value="BB">Barbell (BB)</option>
                                    <option value="BW">Body Weight (BW)</option>
                                    <option value="DB">Dumbbell (DB)</option>
                                    <option value="CAB">Cable (CAB)</option>
                                </select>
                            </div>

                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-200 rounded-b">
                    <button form='update-exercise' className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3" type="submit">Update Exercise</button>
                    <button className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3" onClick={handleDelete}>Delete Exercise</button>
                    <Link href="/" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Go Back</Link>
                </div>
            </div>
            {sameExercise && (
                        <div className="bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg max-w-[80%] flex items-center mx-auto max-w-lg">
                        <svg viewBox="0 0 24 24" className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3">
                            <path fill="currentColor"
                                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                            </path>
                        </svg>
                        <span className="text-red-800">No Changes</span>
                    </div>
                )}
            </>
        )} 
    </>
    )
}

export default UpdateExercise;