import Map from './Map'
import Header from './Header'
import UISidebar from './UISidebar'

function App() {


  return (
    <div id="app-wrapper">
      <Header/>
      <div className="flex h-full">
        <UISidebar/>
        <Map/>
      </div>
    </div>
  )
}

export default App
