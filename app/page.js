"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Brain, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans overflow-x-hidden selection:bg-white/20">

      {/* Full Window Background Visual 
        This is now fixed to the viewport and sits behind everything (z-0).
      */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden">
        {/* The blurry gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-gradient-to-b from-yellow-200/15 via-blue-500/15 to-transparent rounded-full blur-[140px] animate-pulse" />

        {/* The iridescent liquid image scaling to fit */}
        <img
          src="/image.png" /* Replace with your actual iridescent liquid image path */
          alt="Liquid Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-70"
        />

        {/* Subtle vignette/fade to black at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Navbar (z-50) */}
      <nav className="fixed top-0 w-full z-50 px-8 md:px-16 py-8 flex items-center justify-between backdrop-blur-sm bg-black/10">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>Cognitive Learning</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[13px] text-gray-300 font-medium">
          <Link href="#" className="hover:text-white transition">About</Link>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition">
            Language <ChevronDown size={14} />
          </div>
          <Link href="#" className="hover:text-white transition">Contact</Link>
          <Link href="#" className="hover:text-white transition">FAQ</Link>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition ml-4">
            ENG <ChevronDown size={14} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hidden sm:block text-[13px] font-medium text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link href="/signup" className="text-[13px] bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Main Content Area (relative positioning, z-10 or above background) */}
      <main className="relative z-10">

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center pt-48 md:pt-56 pb-20 overflow-hidden">

          {/* Main Text Content */}
          <div className="relative text-center flex flex-col items-center mb-16 md:mb-24">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-[84px] font-bold tracking-tight leading-[1.05] mb-8"
            >
              Elevate Your<br />Learning Experience
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-400 text-sm md:text-base max-w-lg mb-12 leading-relaxed font-normal opacity-80"
            >
              Unlock your cognitive potential in a fully adaptive<br />environment, powered by Applied AI

            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/signup" className="bg-white text-black px-10 py-3.5 rounded-full text-[14px] font-bold hover:bg-gray-200 transition shadow-lg">
                Sign Up & Learn
              </Link>
            </motion.div>
          </div>

          {/* Container for Floating Cards - Visual element removed from here */}
          <div className="relative w-full max-w-[1400px] mx-auto flex-grow flex justify-center items-center min-h-[300px]">

            {/* Floating Card Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute left-[8%] md:left-[12%] top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-56 border border-white/10 z-20"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Trading Pairs</span>
                <div className="bg-white/10 p-1 rounded-full">
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </div>
              <h3 className="text-lg font-medium leading-tight mb-8">
                Unparalleled<br />Market Access
              </h3>
              <div className="flex justify-end">
                <span className="text-gray-500 text-[12px] font-bold">45%</span>
              </div>
            </motion.div>

            {/* Floating Card Right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute right-[8%] md:right-[12%] top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-64 border border-white/10 z-20 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Trading Pairs</span>
                <div className="bg-white/10 p-1 rounded-full">
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-6">96%</div>
              <div className="h-1 bg-white/10 rounded-full w-full">
                <div className="h-full bg-white w-[96%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="relative z-20 py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">The Future of Comprehension</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Traditional translation apps overwhelm you. We match how your brain actually learns by utilizing cognitive load theory and adaptive AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {[
              {
                title: "Cognitive Level Detection",
                icon: Brain,
                desc: "Our AI continuously analyzes your comprehension in real-time, identifying your exact proficiency level across vocabulary, grammar, and context.",
                span: "md:col-span-2",
                bgStyles: "bg-gradient-to-br from-white/5 to-transparent hover:from-white/10"
              },
              {
                title: "Adaptive Translation",
                icon: BookOpen,
                desc: "Receive content in digestible chunks that match your current cognitive load capacity.",
                span: "md:col-span-1",
                bgStyles: "bg-white/5 hover:bg-white/10"
              },
              {
                title: "Progressive Path",
                icon: TrendingUp,
                desc: "The system automatically increases complexity as you improve.",
                span: "md:col-span-1",
                bgStyles: "bg-white/5 hover:bg-white/10"
              },
              {
                title: "Context-Aware Hints",
                icon: Lightbulb,
                desc: "Get intelligent, contextual hints based on your specific learning patterns. We never just give direct answers that bypass the cognitive process.",
                span: "md:col-span-2",
                bgStyles: "bg-gradient-to-tr from-white/5 to-transparent hover:from-white/10"
              },
            ].map((feature, idx) => (
              <div key={idx} className={`glass-panel border border-white/5 rounded-3xl p-8 group transition-all duration-500 flex flex-col justify-between overflow-hidden relative ${feature.span} ${feature.bgStyles}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition duration-700 -mr-10 -mt-10 pointer-events-none" />
                <div className="mb-4 text-white/70 group-hover:text-white transition duration-500 transform group-hover:scale-110 group-hover:-translate-y-1 origin-left">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pre-Footer Call To Action */}
        <section className="relative z-20 py-24 px-6">
          <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden border border-white/10 bg-[#15151a]">
            {/* Glowing background efffect inside CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-stars opacity-50 mix-blend-screen pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight text-white">Ready to rewrite how<br />your brain learns?</h2>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto">Join thousands of others unlocking their true cognitive potential with our adaptive environment.</p>
              <Link href="/signup" className="inline-block bg-white text-black px-10 py-4 rounded-full text-sm font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

        {/* Expanded Professional Footer */}
        <footer className="relative z-20 py-16 px-6 md:px-12 border-t border-white/5 bg-[#0a0a0d]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="text-lg font-semibold tracking-tight text-white mb-4">Cognitive Learning</div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">Elevating the language learning experience through adaptive AI and cognitive load theory.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">© 2026 Cognitive Learning. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-gray-600">
              <Link href="#" className="hover:text-white transition">Twitter</Link>
              <Link href="#" className="hover:text-white transition">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition">GitHub</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}