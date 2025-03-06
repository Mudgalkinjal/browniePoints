type FeatureCardType = {
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardType> = ({ title, description }) => (
  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

const FeaturesSection = () => {
  const features = [
    {
      title: 'Set Goals',
      description:
        'Define your top tasks and break them into actionable steps.',
    },
    {
      title: 'Earn Rewards',
      description:
        'Complete tasks to earn Brownie Points and unlock fun rewards.',
    },
    {
      title: 'Stay Motivated',
      description:
        'Track your progress and stay motivated with positive reinforcement.',
    },
  ]
  return (
    <section className="bg-[#f58d7770] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-gray-600 text-lg">
          Boost your productivity and make goal setting fun with our Brownie
          Points system.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}
export default FeaturesSection
