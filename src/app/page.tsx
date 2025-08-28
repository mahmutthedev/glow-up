import AuthButton from "@/components/auth-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Glow Up
        </h1>
        <AuthButton />
      </nav>
      
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Dating Profile
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload one photo and get 10 AI-enhanced versions that will make your dating profile stand out
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-500 text-sm">
                Drag and drop or click to select
              </p>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>✨ Get 5 free enhancements</p>
              <p>🚀 Quick 30-second processing</p>
              <p>🔒 Your photos are kept private</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
