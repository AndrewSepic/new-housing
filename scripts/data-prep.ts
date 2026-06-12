import { parse } from 'csv-parse'
import * as path from 'path'
import * as fs from 'fs'

type CsvCityData = {
    Rank: string,
    Metro: string,
    'New housing units authorized per 1k existing homes (2024)': string,
    'New housing units authorized per 1k existing homes (2022)':string,
    'Total new housing units authorized (2024)': string,
    'Total new housing units authorized (2022)': string,
    'Percentage change in housing units authorized (2022–2024)': string,
    'Median home price': string,
    Population: string
}

type USCityProperties = {
    rank: Number;
    name: string;
    state: string;
    newHomesPer1K22: number; // 2022
    totalNewHomes22: number // 2022
    newHomesPer1k24: number; // 2024
    totalNewHomes24: number; // 2024
    medianPrice: number;
    population: number;
}

type CityFeature = {
    type: "Feature",
    properties: USCityProperties,
    geometry: {
        type: "Point",
        coordinates: [number, number]
    }
}

( async () => {

    const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"

    const __dirname = import.meta.dirname
    const csvFilePath = path.resolve(__dirname, '../data/testMetros.csv')

    const csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' })
    const toNumber = (s: string) => Number(s.replace(/[$,]/g, ''))

    parse(csvContent, {
        delimiter: ',',
        columns: true
    }, (error, result: CsvCityData[]) => {
        if(error) {
            console.error(error)
        }

        const cities: CityFeature[] = await result.map(async (c) =>  {
            const [city, state ] = c.Metro.split(',')

            // {
            // "type": "FeatureCollection",
            // "features": [
               
            // ]
            // }
                    
            const singleCity:USCityProperties = {
                rank: toNumber(c.Rank),
                name: city,
                state: state,
                newHomesPer1K22: toNumber(c['New housing units authorized per 1k existing homes (2022)']),
                totalNewHomes22: toNumber(c['Total new housing units authorized (2022)']),
                newHomesPer1k24: toNumber(c['New housing units authorized per 1k existing homes (2024)']),
                totalNewHomes24: toNumber(c['Total new housing units authorized (2024)']),
                medianPrice: toNumber(c['Median home price']),
                population: toNumber(c.Population)
            }

            // Geocode City & State
            let coordinates
            try {
                const structuredQuery = new URLSearchParams({place: city, region: state}).toString();
                const geocode = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${structuredQuery}&access_token=${MAPBOX_ACCESS_TOKEN}`)
                const result = await geocode.json();
                coordinates = result.features[0].geometry.coordinates
                console.log(city, state, ':', coordinates)
            } catch(err) {
                console.error(err)
            }
            
            const feature:CityFeature =  {
                "type": "Feature",
                "properties": singleCity,
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                }
            }

            cities.push(feature)
        })

    })
})()





