import { getFlightCount, getMockData } from "./api";
import { formatTableData, validateIATACode } from "./helper";
import { ResponseData, tableData } from "./interfaces";

/** Getting required HTML Elements */
const airportForm = document.getElementById("airport") as HTMLFormElement;
const codeErrorEle = document.getElementById(
  "codeError"
) as HTMLParagraphElement;

const tableEle = document.getElementById("countTable") as HTMLDivElement;
const loaderEle = document.getElementById("loader") as HTMLDivElement;
const mockBtn = document.getElementById("mockData") as HTMLButtonElement;

/**
 * Display loader when data fetching is happening
 */
const showLoader = (show: boolean) => {
  show
    ? loaderEle.classList.remove("hidden")
    : loaderEle.classList.add("hidden");
};

/**
 * Display Error message when validation fails
 * @param show
 * @param msg
 */
const showErrorMessage = (show: boolean, msg?: string) => {
  if (!show) {
    codeErrorEle.classList.add("hidden");
    codeErrorEle.innerText = "";
  } else {
    codeErrorEle.classList.remove("hidden");
    codeErrorEle.innerText =
      msg || "Something went wrong with request, please retry...";
  }
};

/**
 *
 * @param code Code validation helper message
 * @returns
 */
const handlingCodeValidation = (code: string) => {
  if (validateIATACode(code)) {
    showErrorMessage(false);
    return true;
  } else {
    showErrorMessage(true, "Please enter a valid 3-letter IATA code.");
    return false;
  }
};

/**
 * Flight code submission handler, does the validation check for the Code
 * @param e
 */
const formSubmit = async (e: SubmitEvent) => {
  e.preventDefault();
  const formData = new FormData(airportForm);
  const airportCode = formData.get("airport-code") as string;
  if (handlingCodeValidation(airportCode.toUpperCase())) {
    await getData(false, airportCode);
  }
};

/**
 * Generates Table Element based on table data
 * @param data
 * @returns
 */
function createTable(data: tableData): HTMLElement {
  if (!data || Object.keys(data).length === 0) {
    const noData = document.createElement("p");
    noData.className = "text-center text-gray-500";
    noData.textContent = "No data available.";
    return noData;
  }

  const table = document.createElement("table");
  table.className = "min-w-full bg-white border border-gray-200";

  // Create table header with two columns: Key and Value
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Country", "# Flights"];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.className =
      "px-6 py-3 border-b border-gray-200 bg-gray-100 text-center text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider";
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body by iterating over key-value pairs
  const tbody = document.createElement("tbody");

  Object.entries(data).forEach(([key, value], index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-200`;

    // Key Cell
    const keyTd = document.createElement("td");
    keyTd.className =
      "px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 border-b border-gray-200 font-medium";
    keyTd.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    tr.appendChild(keyTd);

    // Value Cell
    const valueTd = document.createElement("td");
    valueTd.className =
      "px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 border-b border-gray-200";
    valueTd.textContent = String(value);
    tr.appendChild(valueTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  return table;
}

/**
 * Button handler for Mock Button to generate table using Mock Data
 */
const mockBtnHandler = async (_e: MouseEvent) => {
  await getData(true);
};

/**
 * Data controller, it converts API data to table data and toggles loader
 * @param mock
 * @param code
 */
const getData = async (mock: boolean, code?: string) => {
  showLoader(true);
  tableEle.innerHTML = "";
  const { success, data, error } = mock
    ? await getMockData()
    : await getFlightCount(code || "");
  if (success) {
    const formattedData = formatTableData(data as ResponseData[]);
    tableEle.appendChild(createTable(formattedData));
  } else {
    showErrorMessage(true, error as string);
  }
  showLoader(false);
};

airportForm.addEventListener("submit", formSubmit);
mockBtn.addEventListener("click", mockBtnHandler);
