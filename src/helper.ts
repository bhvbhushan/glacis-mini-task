import { ResponseData, tableData } from "./interfaces";

export const validateIATACode = (code: string): boolean => {
  const trimmedCode = code.trim().toUpperCase();
  return trimmedCode.length === 3;
};

export const delay = (sec: number): Promise<void> =>{
  return new Promise((resolve) => {
    setTimeout(resolve, sec*1000);
  });
}


export const formatTableData = (data: ResponseData[])=>{
  let flightCount: tableData = {};
  data.forEach(airportData => {
    const arrivals = airportData.airport.pluginData.schedule.arrivals.data
    arrivals.forEach(flightData =>{
      const countryName = flightData.flight.airport.origin.position.country.name || 'N/A'
      flightCount[countryName] = flightCount[countryName] ? flightCount[countryName]+1 : 1
    })
  })
  return flightCount
  
}