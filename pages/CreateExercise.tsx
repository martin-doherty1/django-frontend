"use client";
import React, {useState} from 'react';
import Exercise from '@/app/Models/Exercise';
import {queryClient} from "./_app"
import Link from 'next/link';
import Loading from '@/app/Components/Loading';
import { useMutation } from 'react-query';
import {createExercise} from '@/app/Services/CreateExercise';
import convertType from '@/app/Utils/ConvertShortHandToLongHand';

const CreateExercise = () =>
{
    const [newExercise, setNewExercise] = useState<Exercise | null>(null);
    const [formSuccess, setFormSuccess] = useState<boolean>(false);

    const createExerciseMutation = useMutation(() => createExercise(newExercise!),
        {
            onSuccess: () => {
                setFormSuccess(true);
            },
            onError: (err:Error) => {
                console.error(`Error Creating Exercise: ${err.message}`);
            },
            onSettled: () => {
                queryClient.invalidateQueries('create');
            }
        })

    if (createExerciseMutation.isLoading) {
        return (
            <Loading/>
        )
    }
    
    if (createExerciseMutation.isError) {
        return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Error Creating Exercise</h1>
                <p className="text-gray-600 mb-6"></p>
                <Link href="/"  className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Go
                back to Home Page</Link>
            </div>
        </div>
        )}
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => 
    {
        event.preventDefault();
        createExerciseMutation.mutate();
    }

    return(
        <>
            <title>Create Exercise</title>
            {formSuccess ? (
                <div className="bg-gray-100 h-screen flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h1 className="text-4xl font-bold text-gray-800 mb-8">Created Successfully</h1>
                        <p className="text-gray-600 mb-6">Exercise Name: {newExercise!.exercise_name}</p>
                        <p className="text-gray-600 mb-6">Exercise Description: {newExercise!.description}</p>
                        <p className="text-gray-600 mb-6">Eercise Body Part: {newExercise!.body_part}</p>
                        <p className="text-gray-600 mb-6">Exercise Type: {convertType(newExercise!.type!)}</p>
                        <a href="/" className="inline-block py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">Go
                            back to Home Screen</a>
                    </div>
                </div>
            ) : (

            <div className="bg-white border border-4 rounded-lg shadow relative m-10">

                <div className="flex items-start justify-between p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold">
                        Create Exercise
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <form id='create-exercise' onSubmit={handleSubmit}>
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="exercise-name" className="text-sm font-medium text-gray-900 block mb-2">Exercise Name</label>
                                <input type='text' placeholder='Exercise Name' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required  id="exercise-name" maxLength={50} value={newExercise?.exercise_name ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExercise({ ...newExercise, exercise_name: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="description" className="text-sm font-medium text-gray-900 block mb-2">Description</label>
                                <input type='text' placeholder='Description' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required  id="description" maxLength={300} value={newExercise?.description ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExercise({ ...newExercise, description: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="body-part" className="text-sm font-medium text-gray-900 block mb-2">Body Part</label>
                                <input type='text' placeholder='Body Part' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                required id="body-part" maxLength={5} value={newExercise?.body_part ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewExercise({ ...newExercise, body_part: e.target.value})}/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="type" className="text-sm font-medium text-gray-900 block mb-2">Exercise Type</label>
                                <select id="type" required className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                 onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewExercise({ ...newExercise, type: e.target.value})} defaultValue={""}>
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
                    <button form='create-exercise' className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3" type="submit">Create Exercise</button>
                    <Link href="/" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Go Back</Link>
                </div>

            </div>

            )} 
        </>
    )
}



export default CreateExercise;