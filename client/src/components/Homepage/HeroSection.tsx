type HeroSectionProps = {
  onSignUp: () => void
  onSignIn: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignUp, onSignIn }) => (
  <section className="bg-white text-gray-700 text-center py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">Welcome to Brownie Points!</h1>
    <p className="text-lg mb-8">
      A fun and engaging way to track your productivity, earn rewards, and
      celebrate achievements.
    </p>
    <button
      onClick={onSignUp}
      className="px-6 py-3 bg-[#D4E4DB] text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
    >
      Get Started
    </button>
    <button
      onClick={onSignIn}
      className="px-6 py-3 ml-2 bg-[#D4E4DB] text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
    >
      Sign In
    </button>
  </section>
)
export default HeroSection
