import axios from "axios";
// var api_key = "RIBXT3XYLI69PC0Q";
var api_key = "RIBXT3XYLI69PC0Q";
var API_BASE_URL = 'https://www.alphavantage.co/query?';

// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
const apiClient ={
    // baseURL: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=' + api_key,
    time_series: API_BASE_URL + 'function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=' + api_key,

};



export default apiClient;
