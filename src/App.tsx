function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">🍔 PickFood</h1>
        <p className="text-gray-500">오늘 뭐 먹지?</p>

        <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          시작하기
        </button>
      </div>
    </div>
  )
}

export default App