"use client";

export default function MicroSurvey({ isVisible, onResponse }) {
  const options = ["mastery", "focused", "distracted", "frustrated", "overwhelmed"];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-300 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4 border border-gray-400">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">How do you feel?</h2>
        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onResponse(option)}
              className="px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium capitalize shadow-sm"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

