import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'

import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const center: [number, number] = [-98.25238, 37.45909]

function Map() {
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
            colorAdminBoundaries: "#907a4c",
            //colorWater: "#a9cadb"
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
              //  0,   '#cde2fb',   // lightest — fewest new homes per 1K
                0,  '#86b6ef',
                20,  '#3987e5',
                40,  '#1c5cab',
                60,  '#0d366b'    // darkest — most new homes per 1K
          ],
          'circle-radius': [
            'interpolate', ['linear'], ['sqrt', ['get', 'population']],
            244.95,   4,      // sqrt(60,000)
            509.90,   10,     // sqrt(260,000)
            1581.14,  17      // sqrt(2,500,000) — cap here
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1
        }
      })
    })

     // Create a popup, but don't add it to the map yet
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -20]
    });

    mapRef.current.addInteraction('city-click', {
      type: 'click',
      target: { layerId: 'metros-circles' },
      handler: (e) => {
        console.log("hi", e.feature?.properties)
      }
    });

    // Change cursor to pointer when hovering over a layer
    mapRef.current.addInteraction('mouseenter-interaction', {
        type: 'mouseenter',
        target: { layerId: 'metros-circles' },
        handler: (e) => {
            //mapRef.current.getCanvas().style.cursor = 'pointer';
             // Position the popup at the cursor location and show it
          popup
            .setLngLat(e.lngLat)
            .setHTML(`<strong>New Houses per1K 2022: ${e.feature?.properties.newHomesPer1K22}</strong>`)
            .addTo(mapRef.current);
        }
    });

    // Reset cursor when leaving the layer
    mapRef.current.addInteraction('places-mouseleave-interaction', {
        type: 'mouseleave',
        target: { layerId: 'metros-circles' },
        handler: () => {
            mapRef.current.getCanvas().style.cursor = '';
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
        top: 76,
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

export default Map
