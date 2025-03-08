import Header from '../components/Header'
import MenuBar from '../components/MenuBar'

const weeklyData = [
  { day: 'Monday', status: 'overload' },
  { day: 'Tuesday', status: 'bliss' },
  { day: 'Wednesday', status: 'bite' },
  { day: 'Thursday', status: 'overload' },
  { day: 'Friday', status: 'bliss' },
  { day: 'Saturday', status: 'bite' },
  { day: 'Sunday', status: 'overload' },
]

const statusIcons: { [key: string]: string } = {
  overload: '🍫🍫🍫', // Brownie Overload
  bliss: '🍫🍫', // Brownie Bliss
  bite: '🍫', // Brownie Bite
}

const WeeklyProgress = () => {
  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-10">
      <MenuBar />
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          📊 Weekly Progress
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-gray-300">
                {weeklyData.map(({ day }) => (
                  <th key={day} className="border border-gray-300 p-3 text-lg">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {weeklyData.map(({ day, status }) => (
                  <td
                    key={day}
                    className="border border-gray-300 p-4 text-center text-2xl"
                  >
                    {statusIcons[status]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WeeklyProgress
