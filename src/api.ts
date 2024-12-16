import { ApiResponse, ResponseData } from "./interfaces";
import responseData from "../testData.json";
import { delay } from "./helper";

const apiKey = import.meta.env.VITE_FLIGHT_API_KEY;
const baseUrl = "https://api.flightapi.io/compschedule/";

export const getFlightCount = async (
  airportCode: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${baseUrl}${apiKey}?mode=arrivals&day=1&iata=${airportCode}`
    );

    if (!response.ok) {
      const errorBody = await response.text(); // Get error message from response body
      const { message } = JSON.parse(errorBody);
      throw new Error(message);
    }
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error({ error });
    return { success: false, error: error as string };
  }
};

export const getMockData = async (): Promise<ApiResponse> => {
  await delay(3);
  const data = responseData as ResponseData[];
  return {
    success: true,
    data,
  };
};
