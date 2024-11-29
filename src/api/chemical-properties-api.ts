import { SearchChemicalsResponse } from "../types/SearchChemicalsResponseType";
import axios from 'axios';

// Import mock data
import mockDataReturnAllTrue from './mocks/mock-get-chemical-return-all-true.json';
import mockDataReturnAllFalse from './mocks/mock-get-chemical-return-all-false.json';

export async function searchChemicals(inchiKey: string, return_all: boolean = true): Promise<SearchChemicalsResponse> {
  try {
    const response = await axios.get<SearchChemicalsResponse>(
      `https://w972i5rc5l.execute-api.us-east-2.amazonaws.com/v0/`,
      {
        params: {
          search: inchiKey,
          return_all: return_all
        },
        headers: {
          Authorization: 'Bearer e53c49c7df86fb1bc9c0361ff31a709d9d7eea12'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chemical details:', error);

    // Return the appropriate mock data based on the return_all flag, cast to SearchChemicalsResponse
    return (return_all ? mockDataReturnAllTrue : mockDataReturnAllFalse) as SearchChemicalsResponse;
  }
};
