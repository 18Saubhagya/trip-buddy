"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Plane, Calendar, DollarSign, BarChart3, MapPin, Star, ArrowRight, Menu, X, Mail, Phone, Send } from 'lucide-react';

export default function TripBuddyLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const features = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Plan Trips",
      description: "Create detailed itineraries with AI-powered suggestions for your perfect adventure"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Track Budget",
      description: "Monitor expenses and stay within budget with real-time tracking and insights"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      description: "Get comprehensive insights into your travel patterns and spending habits"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Trip Calendar",
      description: "Organize all your trips in one place with an intuitive calendar view"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Travelers" },
    { value: "50K+", label: "Trips Planned" },
    { value: "150+", label: "Countries" },
    { value: "4.8", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Trip Buddy</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              <button onClick={() => router.push("/signup")}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              <button onClick={() => router.push("/signup")}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-medium hover:opacity-90 transition-opacity w-full">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Your Ultimate Travel Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Plan Your Next Adventure
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Track your travels, manage budgets, and create unforgettable memories with Trip Buddy. 
              Your all-in-one platform for seamless trip planning and management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => router.push("/signup")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center">
                Start Planning Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* About Section - AI Powered */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-12 backdrop-blur-sm" id="about">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Star className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">AI-Powered Trip Generation</h2>
                <p className="text-lg text-slate-300 text-center leading-relaxed">
                  Experience the future of travel planning with our advanced AI technology. Trip Buddy uses 
                  cutting-edge artificial intelligence to create personalized itineraries tailored to your 
                  preferences, budget, and travel style. Simply tell us your destination and interests, and 
                  watch as our AI crafts the perfect adventure for you in seconds. From hidden gems to popular 
                  attractions, smart scheduling to budget optimization - let AI handle the complexity while you 
                  focus on the excitement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-400">Powerful features to make your travel planning effortless</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all hover:scale-105 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Beautiful Dashboard</h2>
            <p className="text-xl text-slate-400">Manage all your trips from one intuitive interface</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold">85 Days Traveled</div>
                      <div className="text-sm text-slate-400">This year</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold">$898,000 Spent</div>
                      <div className="text-sm text-slate-400">Total budget</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold">15 States Visited</div>
                      <div className="text-sm text-slate-400">Across regions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold">4.7 Days Average</div>
                      <div className="text-sm text-slate-400">Per trip</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-400">Have questions? We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Us</h3>
              <p className="text-slate-400 mb-4">Send us an email anytime</p>
              <a href="mailto:support@tripbuddy.com" className="text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium">
                support@tripbuddy.com
              </a>
            </div>

            <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Call Us</h3>
              <p className="text-slate-400 mb-4">Mon-Fri from 9am to 6pm</p>
              <a href="tel:+1234567890" className="text-purple-400 hover:text-purple-300 transition-colors text-lg font-medium">
                +1 (234) 567-890
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder-slate-500 resize-none"
                  ></textarea>
                </div>
                <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 rounded-3xl p-12 text-center backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of travelers who trust Trip Buddy for their adventures
              </p>
              <button onClick={() => router.push("/signup")}
                className="px-10 py-5 bg-white text-blue-950 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Trip Buddy</span>
            </div>
            <p className="text-slate-400">Plan your next adventure</p>
            <div className="text-slate-400">
              © 2025 Trip Buddy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}