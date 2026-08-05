
import metros from './assets/metros.json'

const UISidebar = ({}) => {
    return (
        <div className='w-2/12 h-full bg-white px-4 py-4'>
            <h3 className="text-2xl font-bold mb-4">Filters</h3>
            <div className="flex justify-between items-center mb-4">
                <label className="mr-2 text-l font-bold">Choose Year</label>
                <select className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option>2022</option>
                    <option>2024</option>
                </select>
            </div>

            <label className="mr-2 text-l font-bold">Metros by Rank</label>
            <div className="overflow-scroll h-full">
                {metros.features.map( metro => (
                    <div className="border-b mb-4 flex flex-col bg-slate-100 px-2 py-2">
                        <div className="text-xs">Rank: {metro.properties.rank}</div>
                        <div>{metro.properties.name}, {metro.properties.state}</div>
                    </div>
                ))} 

            </div>


        </div>
    )
}

export default UISidebar