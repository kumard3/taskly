import React from "react";
import Head from "next/head";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <main className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10"></div>
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[length:40px_40px]"></div>

        <div className="z-10 px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-block rounded-full bg-white/10 p-3">
              <img
                src="/logo.webp"
                alt="taskly logo"
                width="100"
                height="100"
                className="rounded-full object-contain"
              />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Streamline Your Workflow with Taskly
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400 md:text-2xl">
            Taskly is your ultimate open-source project management tool.
            Seamlessly import tasks and projects from your favorite applications
            and take control of your productivity. Simplify your workflow,
            enhance team collaboration, and achieve your goals effortlessly with
            Taskly. Discover the power of efficient project management today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/kumard3/taskly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full bg-white/10 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-white/20"
            >
              <FaGithub className="mr-2 h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>
        {/* 
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400 mb-4">Trusted by the largest project management teams.</p>
          <div className="flex justify-center space-x-8">
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
          </div>
        </div> */}
      </main>
    </div>
  );
}
