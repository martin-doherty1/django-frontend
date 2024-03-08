"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from 'react-query';
import ExerciseInfo from "./Components/exerciseInfo";
import ExerciseTypes from "./Components/exerciseCategories";
import Navbar from "./Components/NavigationBar";

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Navbar/>
        <ExerciseInfo/>
        <ExerciseTypes/>
      </QueryClientProvider>
    </>
  );
}
