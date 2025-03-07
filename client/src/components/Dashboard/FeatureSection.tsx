const FeatureSection = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <div className="bg-white shadow-lg rounded-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
)

export default FeatureSection
