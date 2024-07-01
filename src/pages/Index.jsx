import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

const fetchWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error("City not found");
  }
  return response.json();
};

const weatherIcons = {
  Clear: <Sun className="h-10 w-10 text-yellow-500" />,
  Clouds: <Cloud className="h-10 w-10 text-gray-500" />,
  Rain: <CloudRain className="h-10 w-10 text-blue-500" />,
  Snow: <CloudSnow className="h-10 w-10 text-white" />,
  Thunderstorm: <CloudLightning className="h-10 w-10 text-yellow-500" />,
};

const Index = () => {
  const [city, setCity] = useState("");
  const { data, error, refetch } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: false,
  });

  const handleSearch = () => {
    if (city) {
      refetch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Weather Tracker</h1>
      <div className="flex space-x-2">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {error && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {data && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            {weatherIcons[data.weather[0].main] || <Cloud className="h-10 w-10 text-gray-500" />}
            <div>
              <p className="text-2xl">{data.main.temp}°C</p>
              <p>{data.weather[0].description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
