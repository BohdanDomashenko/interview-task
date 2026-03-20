import { useEffect, useState } from "react";
import { CountLabel } from "./CountLabel";
import { IncButton } from "./IncButton";
import axios from "axios";

const COUNT_LOCALSTORAGE_KEY = "COUNT_LOCALSTORAGE_KEY";
// NOTE (ADDED AFTER INTERVIED): in a real app we should use env for such things
const WEATHER_API_URL =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=35.6762&lon=139.6503";

const getPersistedCount = () => {
  const storageValue = localStorage.getItem(COUNT_LOCALSTORAGE_KEY);
  let parsedValue: number;

  if (!storageValue) return 0;

  try {
    parsedValue = JSON.parse(storageValue);
  } catch {
    return 0;
  }

  return typeof parsedValue === "number" ? parsedValue : 0;
};

const App = () => {
  const [count, setCount] = useState<number>(getPersistedCount());
  const [airTemperature, setAirTemperature] = useState<number>();
  const [avgTemperature, setAvgTemperature] = useState<number>();

  const getWeather = async () => {
    try {
      const { data } = await axios.get(WEATHER_API_URL);
      const {
        properties: { timeseries },
      } = data;

      /*       let total = 0;

      for (const item of timeseries) {
        total += item.data.instant.details.air_temperature;
      } */
      // setAvgTemperature(total / timeseries.length);

      // NOTE (ADDED AFTER INTERVIEW): in a real app we should type the entre data response from the backed
      // we should avoid 'as any' constructions and 'any' definitions at all.
      // Used on the interview only to get the IDE autocomplete working
      const sum = (timeseries as any[])
        .map((item) => item.data.instant.details.air_temperature)
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);

      setAvgTemperature(sum / timeseries.length);

      setAirTemperature(timeseries[0].data.instant.details.air_temperature);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncButtonClick = () => {
    setCount((prev) => {
      const newValue = prev + 1;
      localStorage.setItem(COUNT_LOCALSTORAGE_KEY, JSON.stringify(newValue));

      return newValue;
    });
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div>
      <div
        /* NOTE (ADDED AFTER INTERVIEW): in a real app we should think of using tailwind or define styles in .css */
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(100vh - 20px)",
        }}
      >
        <CountLabel value={count} />
        <IncButton onClick={handleIncButtonClick} />
        <div>
          {airTemperature && <div>Current: {airTemperature}</div>}
          {avgTemperature && <div>Avg: {avgTemperature}</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
