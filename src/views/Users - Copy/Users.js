import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from "../../services/api";
import apiRequests from "../../services/apiRequests";

const ListDAta = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          apiClient.time_series);
        const timeSeries = response.data['Time Series (5min)'];
        const data = Object.keys(timeSeries).map(time => ({
          time,
          open: timeSeries[time]['1. open'],
          high: timeSeries[time]['2. high'],
          low: timeSeries[time]['3. low'],
          close: timeSeries[time]['4. close'],
          volume: timeSeries[time]['5. volume'],
        }));
        setStockData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h2>Stock Data for IBM</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Time</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              <td>{entry.open}</td>
              <td>{entry.high}</td>
              <td>{entry.low}</td>
              <td>{entry.close}</td>
              <td>{entry.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListDAta;
