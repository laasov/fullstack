import axios from 'axios'
import { useState, useEffect } from 'react'

// 2.13 (maiden tiedot, step 2) NOT DONE

//const CountryButton = ({ country }) => {
//  console.log('countrybutton:', country)
//  
//  return (
//    <button onClick={console.log('clicked')}>
//      show
//    </button>
//  )
//}
//
//const Country = ({ country }) => <p>{country.name.common} <CountryButton country={country}/></p>

const Country = ({ country }) => <p>{country.name.common}</p>

const Flag = ({ flagUrl }) => <img src={flagUrl} alt='the flag of the country'/>

const WeatherTrue = ({ weather, capital }) => {

  const temp = Math.round((weather.main.temp - 273.15) * 1000) / 1000
  const icon = weather.weather[0].icon
  const city = capital
  const wind = weather.wind.speed
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <p>temperature in {city} {temp} Celsius</p>
      <img src={iconUrl} alt='weather icon'/>
      <p>wind {wind} m/s</p>
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState([])
  const [gotWeather, setGotWeather] = useState(false) // Note own implementation
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    console.log('get weather')
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
      .then(response => {
        console.log('get weather promise fulfilled')
        setWeather(response.data)
        setGotWeather(true)
      })
  }, [])

  if (gotWeather) {
    return (<WeatherTrue weather={weather} capital={capital} />)
  } else {
    return (<div><p>Failed to retrieve weather data</p></div>)
  }
}

const CountryFull = ({ countryData }) => {
  return (
    <div>
      <h3>
        {countryData.name.common}
      </h3>
      <p>capital {countryData.capital}</p>
      <p>area {countryData.area}</p>
      <p><b>Languages:</b></p>
      <ul>
        {Object.entries(countryData.languages).map(item => item[1]).map(item => <li>{item}</li>)}
      </ul>
      <p><b>Flag:</b></p>
        <Flag flagUrl={countryData.flags.png} />
      <p><b>Weather in {countryData.capital[0]}:</b></p>
      <Weather capital={countryData.capital[0]} />
    </div>
  )
}

const FilterForm = ({ filter, handleFilter }) => {
  return (
    <form>
      <div>
        Find countries: <input value={filter} onChange={handleFilter}/>
      </div>
    </form>
  )
}

const CountryList = ({ countries, filt }) => {
  // remove non matched in flatMap
  // map to Country component or empty string
  // filter empty strings
  const filteredCountries = countries.flatMap(country =>
    country.name.common.toLowerCase().includes(filt.toLowerCase())
      ? <Country key={country.name.common} country={country}/>
      : '').filter(c => c !== '')

  if (filteredCountries.filter(c => c !== '').length > 10) {

    return (<p>Too many matches, specify another filter</p>)

  } else if (filteredCountries.length !== 1) {

    return (filteredCountries)

  } else {
    
    const matchName = filteredCountries.filter(c => c !== '')[0].key
    const matchData = countries.find(country => country.name.common === matchName)
    return (<CountryFull countryData={matchData}/>)

  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  return (
    <div>
      <h2>Choose Country</h2>
      <FilterForm filter={filter} handleFilter={handleFilter}/>
      <h2>Results</h2>
      <CountryList countries={countries} filt={filter}/>
    </div>
  )
}

export default App
