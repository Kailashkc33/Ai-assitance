"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
  abn?: string;
  businessGoals: string;
  budget: number;
  contactMethod: "Email" | "Phone";
}

export default function FormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      
      setSubmitted(true);
    } catch {
      setError("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
                <Link href="/voice" className="text-gray-600 hover:text-blue-600 transition-colors">
                  🎙️ Voice Chat
                </Link>
                <Link href="/form" className="text-blue-600 font-medium">
                  📝 Contact Form
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-6">
              ✅
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
            <p className="text-gray-600 mb-8">
              Your form has been submitted successfully. We&apos;ll get back to you soon with personalized business consultation.
            </p>
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              <span>Return to Home</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/voice" className="text-gray-600 hover:text-blue-600 transition-colors">
                🎙️ Voice Chat
              </Link>
              <Link href="/form" className="text-blue-600 font-medium">
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
            📝 Business Consultation Form
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your business goals and we&apos;ll connect you with the right experts for personalized consultation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  {...register("fullName", { required: "Full Name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="text-red-500 text-sm mt-1 block">{errors.fullName.message}</span>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                ABN <span className="text-gray-400 text-sm font-normal">(optional)</span>
              </label>
              <input
                type="text"
                {...register("abn")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Australian Business Number"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Business Goals *</label>
              <textarea
                {...register("businessGoals", { required: "Business Goals are required" })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Describe your business goals and what you hope to achieve..."
              />
              {errors.businessGoals && <span className="text-red-500 text-sm mt-1 block">{errors.businessGoals.message}</span>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Budget (AUD) *</label>
                <input
                  type="number"
                  {...register("budget", { 
                    required: "Budget is required", 
                    min: { value: 0, message: "Budget must be positive" } 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="5000"
                />
                {errors.budget && <span className="text-red-500 text-sm mt-1 block">{errors.budget.message}</span>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Preferred Contact Method *</label>
                <div className="space-y-3 mt-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      value="Email"
                      {...register("contactMethod", { required: "Select a contact method" })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📧 Email</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      value="Phone"
                      {...register("contactMethod", { required: "Select a contact method" })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">📞 Phone</span>
                  </label>
                </div>
                {errors.contactMethod && <span className="text-red-500 text-sm mt-1 block">{errors.contactMethod.message}</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Consultation Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 