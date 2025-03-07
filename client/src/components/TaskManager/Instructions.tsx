type InstructionType = {
  onClose: () => void
}

const Instructions: React.FC<InstructionType> = ({ onClose }) => {
  return (
    <section className="relative bg-[#D4E4DB] p-4 rounded-lg mb-6 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-800 hover:text-red-500"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-2">How to Use</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li>Create tasks with the "Add More Tasks" button.</li>
        <li>Filter tasks by category using the buttons above.</li>
        <li>Click on tasks to mark them as completed.</li>
        <li>Delete tasks if needed.</li>
      </ul>
    </section>
  )
}

export default Instructions
