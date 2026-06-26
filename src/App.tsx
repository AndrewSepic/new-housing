import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'

import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const center: [number, number] = [-98.25238, 37.45909]

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    mapboxgl.accessToken = accessToken

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: center,
      zoom: 4,
    })

    mapRef.current.on('style.load', () => {
      mapRef.current?.addSource('metros', {
        'type': 'geojson',
        'data': '/metros.json'
      })

      mapRef.current?.addLayer({
        id: 'metros-circles',
        type: 'circle',
        slot: 'middle',
        source: 'metros',
        paint: {
          'circle-color': 'blue',
          'circle-radius': 5,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2

        }
      })
    })



    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <>
      <div style={{
        margin: '10px 10px 0 0',
        width: 300,
        right: 0,
        top: 0,
        position: 'absolute',
        zIndex: 10,
      }}>
        <SearchBox
          accessToken={accessToken}
          map={mapRef.current ?? undefined}
          mapboxgl={mapboxgl}
          value={inputValue}
          options={{ proximity: center }}
          onChange={(d) => setInputValue(d)}
          marker
        />
      </div>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}

export default App
