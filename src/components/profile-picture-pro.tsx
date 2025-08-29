"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Loader2, Download, DownloadCloud, LogIn, Coins, Menu, ChevronDown, Star, Users, Shield, Sparkles, TrendingUp, Clock } from "lucide-react";
import AuthButton from "@/components/auth-button";

export default function ProfilePicturePro() {
  const { data: session, status } = useSession();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("Natural");
  const [selectedScenario, setSelectedScenario] = useState("Food Scenarios");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserCredits();
    }
  }, [session]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();
      if (data.success) {
        setUserCredits(data.credits);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const handleGeneratePhotos = async () => {
    if (!uploadedImage || !uploadedFile || !session?.user || userCredits < 1) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: uploadedImage,
          mimeType: uploadedFile.type,
          physique: selectedStyle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Generated images received:", data.images.length);
        console.log("First image preview:", data.images[0]?.substring(0, 100));
        setGeneratedImages(data.images);
        setUserCredits(data.remainingCredits);
      } else {
        console.error("Failed to generate images:", data.error);
        alert(data.error || "Failed to generate images. Please try again.");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return;

    try {
      // Create a simple zip-like download by downloading each image
      for (let i = 0; i < generatedImages.length; i++) {
        await downloadImage(generatedImages[i], `profile-picture-${i + 1}.png`);
        // Small delay between downloads to avoid overwhelming the browser
        if (i < generatedImages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading all images:', error);
      alert('Failed to download all images. Please try again.');
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation Bar */}
        <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Glow Up</h1>
                  <p className="text-xs text-slate-400 -mt-1">Profile Picture Pro</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-200 text-sm font-medium">Join 50,000+ users getting better matches</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Dating Profile</span>
            </h1>
            <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto mb-12">
              Get 10 AI-powered professional photos that make you stand out and get more matches, instantly.
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600 p-12 backdrop-blur-sm shadow-2xl rounded-3xl max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-3">Get Started Free</h2>
                <p className="text-slate-300 mb-6 text-lg">
                  Sign in with Google to get <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-3 py-1">3 free credits</Badge> and start generating amazing profile pictures!
                </p>
              </div>
              <Button
                onClick={() => signIn("google")}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-4 text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-400/30 w-full"
                size="lg"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
              
              {/* Trust Indicators */}
              <div className="flex flex-col space-y-4 text-center pt-6 border-t border-slate-600">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Privacy Protected</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">4.9/5 Rating</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">No subscription required • Cancel anytime</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Glow Up</h1>
                  <p className="text-xs text-slate-400 -mt-1">Profile Picture Pro</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 rounded-xl border border-amber-500/30 shadow-lg">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="text-white font-bold text-lg">{userCredits}</span>
                <span className="text-amber-200 text-sm font-medium">credits</span>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 hover:bg-purple-500/30 transition-all duration-300 cursor-default">
            <Users className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-200 text-sm font-medium">Join 50,000+ users getting better matches</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Dating Profile</span>
          </h1>
          <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto mb-8">
            Get 10 AI-powered professional photos that make you stand out and get more matches, instantly.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mb-12 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-2 text-slate-400">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">100% Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">4.9/5 Rating (2,847 reviews)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Ready in 2 minutes</span>
            </div>
          </div>
        </div>

      {/* Progress Timeline */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${uploadedImage ? 'text-purple-400' : 'text-white'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              uploadedImage ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              1
            </div>
            <span className="font-medium">Upload Photo</span>
          </div>
          
          <div className={`w-16 h-0.5 transition-all duration-300 ${uploadedImage ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-slate-600'}`}></div>
          
          <div className={`flex items-center space-x-2 ${uploadedImage ? 'text-white' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              uploadedImage ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'bg-slate-700 text-slate-500'
            }`}>
              2
            </div>
            <span className="font-medium">Customize Style</span>
          </div>
          
          <div className={`w-16 h-0.5 transition-all duration-300 ${isGenerating ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-slate-600'}`}></div>
          
          <div className={`flex items-center space-x-2 ${isGenerating ? 'text-white' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              isGenerating ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'
            }`}>
              3
            </div>
            <span className="font-medium">Generate Photos</span>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600 p-10 mb-12 backdrop-blur-sm shadow-2xl rounded-3xl">
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  1
                </span>
                Upload Your Best Photo
              </h2>
              <p className="text-slate-400 text-lg">
                Get 10 AI-powered photos in Tinder-worthy scenarios
              </p>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-500 rounded-2xl p-12 cursor-pointer hover:border-purple-400 hover:bg-slate-700/30 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl group">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-1">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>

            {uploadedImage && (
              <div className="w-48">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    Hey check for you.
                    <div className="ml-1 w-4 h-4 bg-yellow-500 rounded"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  2
                </span>
                Customize Your Photoshoot
              </h3>
              <p className="text-slate-400 text-lg">
                Choose your preferred style and build emphasis
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div>
              <div className="mb-4">
                <h4 className="text-white font-bold text-2xl mb-3 flex items-center">
                  <span className="mr-3">💪</span>
                  Physique Style
                </h4>
                <p className="text-slate-300 text-lg mb-1">Choose your build emphasis</p>
                <p className="text-slate-500 text-sm">This will determine how your photos are enhanced</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { value: "Natural", label: "Natural", desc: "Everyday build", icon: "🚶" },
                  { value: "Toned", label: "Toned", desc: "Subtle definition", icon: "🏃" },
                  { value: "Athletic", label: "Athletic", desc: "Clear definition", icon: "🏋️" },
                  { value: "Strong", label: "Strong", desc: "Well-defined frame", icon: "💪" }
                ].map((style) => (
                  <div
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      selectedStyle === style.value
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 shadow-xl shadow-purple-500/30"
                        : "bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-slate-600 hover:border-purple-400/50 hover:from-slate-700/80 hover:to-slate-600/80"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{style.icon}</span>
                      <div className="flex-1">
                        <h5 className={`font-bold text-xl mb-1 ${selectedStyle === style.value ? "text-white" : "text-slate-200"}`}>
                          {style.label}
                        </h5>
                        <p className={`text-base ${selectedStyle === style.value ? "text-purple-100" : "text-slate-400"}`}>
                          {style.desc}
                        </p>
                      </div>
                    </div>
                    {selectedStyle === style.value && (
                      <div className="absolute top-3 right-3">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold disabled:opacity-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-400/30"
          disabled={!uploadedImage || isGenerating || userCredits < 1}
          onClick={handleGeneratePhotos}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Photos...
            </>
          ) : userCredits < 1 ? (
            "❌ No Credits Remaining"
          ) : (
            <>
              <Coins className="w-5 h-5 mr-2" />
              ✨ Generate Photos (1 credit)
            </>
          )}
        </Button>
      </Card>

      {(generatedImages.length > 0 || isGenerating) && (
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600 p-8 backdrop-blur-sm shadow-2xl rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-white flex items-center">
              <span className="mr-3">✨</span>
              Your New Profile Pictures
            </h3>
            {generatedImages.length > 0 && (
              <Button
                onClick={downloadAllImages}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-xl border-2 border-green-400 hover:border-green-300 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <DownloadCloud className="w-5 h-5 mr-2" />
                Download All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-6 max-w-6xl mx-auto">
            {isGenerating ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="aspect-square bg-slate-700 rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
                  </div>
                </div>
              ))
            ) : (
              generatedImages.map((image, index) => (
                <div key={index} className="relative group aspect-square bg-slate-700 rounded-lg overflow-hidden">
                  {image && image.trim() !== "" && image !== "data:," ? (
                    <img
                      src={image}
                      alt={`Generated profile picture ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                      onError={(e) => {
                        console.error(`Image ${index + 1} failed to load. URL:`, image);
                        console.error("Error details:", e);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-600">
                      <div className="text-center text-slate-300">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Image {index + 1}</p>
                        <p className="text-xs opacity-75">Empty URL</p>
                        <p className="text-xs mt-1 break-all px-2">{image ? image.substring(0, 50) + "..." : "No data"}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => downloadImage(image, `profile-picture-${index + 1}.png`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-gray-200 shadow-xl border-2 border-gray-300 hover:border-gray-400 font-semibold"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Sample Results Section */}
      {!isGenerating && generatedImages.length === 0 && (
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">See the Transformation</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Real results from our AI-powered photo generation. Your photos could look like this too.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600 mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Upload Original</h3>
                <p className="text-slate-400">Your everyday selfie</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600 mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Enhancement</h3>
                <p className="text-slate-400">Professional lighting & style</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600 mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🔥</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Dating Ready</h3>
                <p className="text-slate-400">10x more matches</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 mb-4 italic">"Got 3x more matches in the first week! The photos look so professional."</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-semibold">Sarah M.</p>
                  <p className="text-slate-400 text-sm">San Francisco</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 mb-4 italic">"Amazing quality! People think I hired a professional photographer."</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-semibold">Mike D.</p>
                  <p className="text-slate-400 text-sm">New York</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 rounded-2xl p-6 border border-slate-600">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 mb-4 italic">"Easy to use and the results exceeded my expectations completely!"</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-semibold">Alex R.</p>
                  <p className="text-slate-400 text-sm">Los Angeles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      </div>
    </div>
    </>
  );
}