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

    mapRef.current = new mapboxgl.Map({
      accessToken: accessToken,
      container: mapContainerRef.current!,
      center: center,
      zoom: 4,
      config: {
        basemap: {
            theme: 'faded',
            colorMotorways: "#e5f5dc",
            colorTrunks: "#e5f5dc",
            colorRoads: "#e5f5dc",
            colorGreenspace: "#e3eece",
            showPedestrianRoads: false,
            showPointOfInterestLabels: false,
            showRoadLabels: false,
            showIndoorLabels: false,
            colorPlaceLabels: "#574b1e",
        }
    },
    })

    mapRef.current?.on('style.load', () => {

      mapRef.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      mapRef.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 2 });

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
          'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'newHomesPer1K22'],
               0,   '#2166ac',   // low  → blue
              10,  '#67a9cf',
              20,  '#f7f7f7',   // mid  → neutral
              30,  '#ef8a62',
              40,  '#b2182b'    // high → red
          ],
          'circle-radius': 10,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      })
    })

    mapRef.current.addInteraction('city-click', {
      type: 'click',
      target: { layerId: 'metros-circles' },
      handler: (e) => {
        console.log("hi", e.feature?.properties)
      }
    });



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
