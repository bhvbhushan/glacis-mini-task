export interface ResponseData {
  airport: Airport;
  [key: string]: any;
}

interface Airport {
  pluginData: PluginData;
}

interface PluginData {
  schedule: Schedule;
  [key: string]: any;
}

interface Schedule {
  arrivals: ScheduleArrivals;
}

interface ScheduleArrivals {
  [key: string]: any;
  data: Datum[];
}

interface Datum {
  flight: DatumFlight;
}

interface DatumFlight {
  airport: FlightAirport;
}

interface FlightAirport {
  origin: Origin;
}

interface Origin {
  position: Position;
  visible: boolean;
  [key: string]: any;
}

interface Position {
  country: CountryDetails;
}

interface CountryDetails {
  name: string;
}

export interface tableData {
  [key: string]: number
}