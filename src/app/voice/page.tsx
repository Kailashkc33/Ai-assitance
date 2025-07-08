// File: /app/voice/page.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function VoicePage() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
    } catch {
      setMicPermission(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    setTranscript("");
    setResponse("");
    audioChunks.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      
      mediaRecorder.onstop = handleStop;
      mediaRecorder.start();
      setRecording(true);
      setMicPermission(true);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
      setMicPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setRecording(false);
    setLoading(true);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process recording");
      }
      
      const data = await res.json();
      setTranscript(data.transcript || "");
      
      // If there's an audio response, play it
      if (data.audio) {
        const audioBuffer = Buffer.from(data.audio, 'base64');
        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // If no audio, we can use browser's speech synthesis as fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 0.8;
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
          
          utterance.onend = () => setIsPlaying(false);
        }
      }
      
      setResponse(data.response || "Thank you for your message!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing your request. Please try again.");
    }

    setLoading(false);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              🏠 ClientBridge
            </Link>
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎙️ AI Voice Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Speak naturally with our AI assistant. Ask questions, get help, or just have a conversation!
          </p>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Status Indicators */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              micPermission === false 
                ? 'bg-red-100 text-red-700' 
                : micPermission === true 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                micPermission === false 
                  ? 'bg-red-500' 
                  : micPermission === true 
                  ? 'bg-green-500' 
                  : 'bg-gray-500'
              }`}></div>
              <span className="text-sm font-medium">
                {micPermission === false ? 'Microphone Blocked' : 
                 micPermission === true ? 'Microphone Ready' : 
                 'Checking Microphone...'}
              </span>
            </div>
            
            {recording && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-100 text-red-700 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-sm font-medium">Recording...</span>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Processing...</span>
              </div>
            )}
          </div>

          {/* Microphone Button */}
          <div className="flex justify-center mb-8">
            {!recording && !loading && (
              <button
                onClick={startRecording}
                disabled={micPermission === false}
                className={`relative group ${
                  micPermission === false 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 transition-transform'
                }`}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  🎤
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            )}
            
            {recording && (
              <button
                onClick={stopRecording}
                className="relative group hover:scale-105 transition-transform"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white text-3xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
                  ⏹️
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4">
            {transcript && (
              <div className="flex justify-end">
                <div className="bg-blue-100 rounded-2xl rounded-br-md px-6 py-4 max-w-xs lg:max-w-md">
                  <p className="text-blue-800 font-medium">You said:</p>
                  <p className="text-blue-700">{transcript}</p>
                </div>
              </div>
            )}
            
            {response && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-6 py-4 max-w-xs lg:max-w-md">
                  <p className="text-gray-800 font-medium">AI Assistant:</p>
                  <p className="text-gray-700">{response}</p>
                  {isPlaying && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-600">Playing response...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Audio Element */}
          <audio 
            ref={audioRef} 
            onEnded={handleAudioEnded}
            className="hidden"
          />
        </div>

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Click the microphone button to start recording</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Speak clearly and naturally</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Click the stop button when you&apos;re done</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Wait for the AI to process and respond</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
