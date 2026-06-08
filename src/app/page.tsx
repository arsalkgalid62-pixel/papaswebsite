import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Education Hub</h1>
            <Link 
              href="/admin/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Quality Education Resources
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Access notes, past papers, and video lessons for O Level & A Level subjects
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/subjects/o-level-english" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                O Level English
              </h3>
              <p className="mt-2 text-gray-600">
                Comprehensive notes, past papers, and video lessons for O Level English Language & Literature
              </p>
            </div>
          </Link>

          <Link href="/subjects/a-level-english" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                A Level English
              </h3>
              <p className="mt-2 text-gray-600">
                Advanced study materials for A Level English Language & Literature
              </p>
            </div>
          </Link>

          <Link href="/subjects/o-level-psychology" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                O Level Psychology
              </h3>
              <p className="mt-2 text-gray-600">
                Study materials and resources for O Level Psychology
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📄</div>
              <h4 className="font-semibold text-gray-900">Downloadable Notes</h4>
              <p className="text-gray-600">High-quality study notes in PDF and DOCX formats</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎥</div>
              <h4 className="font-semibold text-gray-900">Video Lessons</h4>
              <p className="text-gray-600">Comprehensive video tutorials and explanations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-semibold text-gray-900">Past Papers</h4>
              <p className="text-gray-600">Organized collection of past examination papers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}