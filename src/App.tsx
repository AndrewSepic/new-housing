import Map from './Map'
import Header from './Header'
import UISidebar from './UISidebar'
import { AppProvider } from './Providers/AppContext'

function App() {


  return (
    <div id="app-wrapper">
      <AppProvider>
        <Header/>
        <div className="flex h-full">
          <UISidebar/>
          <Map/>
        </div>
      </AppProvider>
    </div>
  )
}

export default App
