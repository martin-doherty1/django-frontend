"use client";
import React from "react";
import {useRouter} from "next/navigation";
import { QueryClient, QueryClientProvider } from 'react-query';
import ExerciseInfo from "./Components/exerciseInfo";
import ExerciseTypes from "./Components/exerciseCategories";

export default function Home() {
  const queryClient = new QueryClient();
  const router = useRouter();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ExerciseInfo/>
        <ExerciseTypes/>
        <button onClick={() => router.push('/Search')}>go to search</button>
        <br/>
        <button onClick={() => router.push('/CreateExercise')}>Create Exercise</button>
      </QueryClientProvider>
    </>
  );
}
