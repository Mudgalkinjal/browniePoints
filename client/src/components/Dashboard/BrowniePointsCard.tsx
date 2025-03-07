const BrowniePointsCard = ({
  totalBrowniePoints,
  completedCount,
  incompletedCount,
  animate,
}: {
  totalBrowniePoints: number
  completedCount: number
  incompletedCount: number
  animate: boolean | null
}) => (
  <div className="bg-gradient-to-r from-[#f58d7770] to-[#ec3d1a70] shadow-md rounded-lg p-6 text-center">
    <h2 className="text-2xl font-bold mb-4 text-gray-700">
      Total Brownie Points
    </h2>
    <p
      className={`inline-block ${
        animate ? 'bounce-three' : ''
      } text-3xl font-bold text-gray-700 flex items-center justify-center gap-2`}
    >
      {totalBrowniePoints} <span>🍫</span>
    </p>
    <div className="mt-4 flex justify-center gap-4 text-lg">
      <span className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
        ✅ Completed: {completedCount}
      </span>
      <span className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
        ❌ Incomplete: {incompletedCount}
      </span>
    </div>
  </div>
)

export default BrowniePointsCard
