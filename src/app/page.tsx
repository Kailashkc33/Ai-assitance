import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-800">
              🏠 ClientBridge
            </div>
            <div className="flex space-x-4">
              <Link href="/voice" className="text-blue-600 font-medium">
                🎙️ Voice Chat
              </Link>
              <Link href="/form" className="text-gray-600 hover:text-blue-600 transition-colors">
                📝 Contact Form
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to ClientBridge
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Your AI-powered business consultation platform. Connect with our intelligent assistant 
              through voice or fill out our contact form to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/voice" className="group">
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    🎙️
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Voice Chat
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Speak naturally with our AI assistant. Ask questions, get business advice, 
                    or discuss your consultation needs.
                  </p>
                  <div className="inline-flex items-center space-x-2 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>Start Conversation</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/form" className="group">
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    📝
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Contact Form
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Fill out our detailed contact form to get personalized business consultation 
                    and connect with our experts.
                  </p>
                  <div className="inline-flex items-center space-x-2 text-green-600 font-medium group-hover:text-green-700 transition-colors">
                    <span>Get Started</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Why Choose ClientBridge?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mx-auto mb-4">
                  🤖
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AI-Powered</h4>
                <p className="text-gray-600 text-sm">
                  Advanced AI technology for intelligent business consultation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl mx-auto mb-4">
                  ⚡
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Instant Response</h4>
                <p className="text-gray-600 text-sm">
                  Get immediate answers and guidance through voice or text
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl mx-auto mb-4">
                  🎯
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Expert Guidance</h4>
                <p className="text-gray-600 text-sm">
                  Connect with business experts for personalized consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
