import { ResponseData, tableData } from "./interfaces";

export const validateIATACode = (code: string): boolean => {
  const regex = /^[A-Za-z]{3}$/;
  const trimmedCode = code.trim().toUpperCase();
  return trimmedCode.length === 3 && regex.test(code);
};

/** Generating artificial delay for Mock Data */
export const delay = (sec: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};

/** Transforms API Response data into Table Data format */
export const formatTableData = (data: ResponseData[]) => {
  let flightCount: tableData = {};
  data.forEach((airportData) => {
    const arrivals = airportData.airport.pluginData.schedule.arrivals.data;
    arrivals.forEach((flightData) => {
      const countryName =
        flightData.flight.airport.origin.position.country.name || "N/A";
      flightCount[countryName] = flightCount[countryName]
        ? flightCount[countryName] + 1
        : 1;
    });
  });
  return flightCount;
};
