interface WeatherData {
  temperature: number;
  conditions: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  conditions: string;
  icon: string;
  precipitation: number;
}

export async function getWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=7`
    );

    if (!response.ok) return null;

    const data = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      conditions: getWeatherCondition(data.current.weather_code),
      icon: getWeatherIcon(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      forecast: data.daily.time.map((date: string, index: number) => ({
        date,
        tempHigh: Math.round(data.daily.temperature_2m_max[index]),
        tempLow: Math.round(data.daily.temperature_2m_min[index]),
        conditions: getWeatherCondition(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index]),
        precipitation: Math.round(data.daily.precipitation_sum[index] * 100) / 100,
      })),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

function getWeatherCondition(code: number): string {
  const conditions: { [key: number]: string } = {
    0: 'Clear',
    1: 'Mostly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Severe Thunderstorm',
  };
  return conditions[code] || 'Unknown';
}

function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}
