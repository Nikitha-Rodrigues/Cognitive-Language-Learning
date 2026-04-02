"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Lightbulb, BookOpen, CircleCheckBig, Sparkle, Earth, Speech, Target } from 'lucide-react';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      title: "Cognitive Level Detection",
      description:
        "Our AI analyzes your comprehension in real-time, identifying your exact proficiency level across vocabulary, grammar, and context understanding.",
      icon: Brain,
    },
    {
      title: "Adaptive Translation",
      description:
        "No more overwhelming full translations. Receive content in digestible chunks that match your current cognitive load capacity.",
      icon: BookOpen,
    },
    {
      title: "Progressive Learning Path",
      description:
        "As you comprehend more, the system automatically increases complexity, ensuring continuous growth without frustration.",
      icon: TrendingUp,
    },
    {
      title: "Context-Aware Hints",
      description:
        "Get intelligent hints based on your learning patterns, never just direct answers that bypass the learning process.",
      icon: Lightbulb,
    },
  ];

  const stats = [
    { value: "94%", label: "Better Retention", icon: CircleCheckBig },
    { value: "3.2x", label: "Faster Progress", icon: Sparkle },
    { value: "10k+", label: "Active Learners", icon: Earth },
    { value: "47", label: "Languages", icon: Speech },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-highlight opacity-50" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent-primary) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Learn Languages Like Your
              <span className="text-gradient block mt-2">
                Brain Actually Learns
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-textSecondary max-w-3xl mx-auto mb-12"
          >
            No more overwhelming translations. Our AI reads your cognitive state
            and serves content at YOUR comprehension level - just enough to
            challenge, never enough to overwhelm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
            href="/signup"
            className="px-8 py-4 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 border border-accent-primary rounded-lg hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
            Login
          </Link>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                className="glass-panel rounded-xl p-6 text-center"
              > 
                <div className="flex justify-center mb-4 text-accent-primary">
                  <stat.icon size={48} strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-textSecondary text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-textSecondary text-lg max-w-2xl mx-auto">
              Traditional translation apps overwhelm you. We take a different
              approach - one that matches how your brain actually learns.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="card-hover glass-panel rounded-xl p-8 border border-accent-primary/20 hover:border-accent-primary"
              >
                <div className="mb-4 text-accent-primary transition-transform duration-300 group-hover:scale-110"><feature.icon size={48} strokeWidth={1.5} /></div>
                <h3 className="text-2xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Detailed */}
      <section className="py-20 px-4 bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                The Problem with
                <span className="text-gradient block">Traditional Apps</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">❌</div>
                  <p className="text-textSecondary">
                    Full translations that overwhelm your cognitive load
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">❌</div>
                  <p className="text-textSecondary">
                    One-size-fits-all approach that ignores your current level
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">❌</div>
                  <p className="text-textSecondary">
                    Direct answers that bypass the learning process
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-panel rounded-xl p-8"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold mb-4">
                Our Cognitive Approach
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Your Current Level</span>
                    <span className="text-accent-primary">42%</span>
                  </div>
                  <div className="h-2 bg-bg-highlight rounded-full overflow-hidden">
                    <div className="h-full w-[42%] bg-accent-primary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Content Difficulty</span>
                    <span className="text-accent-primary">Adaptive</span>
                  </div>
                  <div className="h-2 bg-bg-highlight rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-accent-primary rounded-full" />
                  </div>
                </div>
                <p className="text-textSecondary mt-4">
                  Your learning path dynamically adjusts based on your
                  comprehension. Never too easy, never too hard - always just
                  right.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass-panel rounded-2xl p-12 border border-accent-primary/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Learn the Way Your Brain Was Designed To?
            </h2>
            <p className="text-textSecondary text-lg mb-8">
              Join thousands of learners who've discovered the power of
              cognitively-adapted language learning.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
              Start Your Cognitive Journey
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}