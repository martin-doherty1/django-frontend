import GetExercises from "@/app/Services/GetExercises";
import { API_URLS } from "@/app/Consts/ApiUrls";
import Exercise from "@/app/Models/Exercise";
import 'jest-fetch-mock'
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

describe('GetExercises', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    })

    it('returns exercises with 200 status code', async () => 
    {
        // Arrange
        const mockExercise: Exercise[] = [{   
            id: 4,
            exercise_name: "Bicep",
            body_part: "arm",
            description: "bigger biceps",
            type: "BB"
        },
        {
            id: 4,
            exercise_name: "Bicep",
            body_part: "arm",
            description: "bigger biceps",
            type: "BB"
        }]

        const mockData = { results: mockExercise};
        fetchMock.mockResponseOnce(JSON.stringify(mockData));

        // Action
        const exercises = await GetExercises();
        
        // Assertion
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(exercises.length).toBe(2);
        expect(fetchMock).toHaveBeenCalledWith(API_URLS.GET_POST_EXERCISES);
    })

    it('returns error and status if not OK response code', async () => 
    {
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({}), {status: 500});

        //Action
        await expect(GetExercises()).rejects.toThrow('Http Error Status Code: 500');

        // Assertion
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(API_URLS.GET_POST_EXERCISES);
    })

    it('returns Error with message no results if no results from search', async () => 
    {
        // Arrange
        fetchMock.mockResponseOnce(JSON.stringify({results: []}), {status: 200});

        //Action
        await expect(GetExercises()).rejects.toThrow('No Results!!');

        // Assertion
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(API_URLS.GET_POST_EXERCISES)
    })
})