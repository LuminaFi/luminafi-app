'use client';

import { useOCAuth } from '@opencampus/ocid-connect-js';
import React from 'react';

import Features from '~/components/feature';
import Content from '~/components/content';
import CallToAction from '~/components/CTA';
// import Teams from '~/components/team';
// import FAQs from '~/components/FAQs';
import Content2 from '~/components/content2';
import Home from '~/container/home';

export default function HomePage() {
  const { authState } = useOCAuth();

  if (authState?.error) {
    return <div>Error: {authState.error.message}</div>;
  }

  // Add a loading state
  if (authState?.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Home />
      <Features />
      <Content />
      <section className="bg-zinc-50 py-12 md:py-20 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <h2 className="text-4xl font-medium lg:text-5xl">
              Tailus UI in numbers
            </h2>
            <p>
              Gemini is evolving to be more than just the models. It supports an
              entire to the APIs and platforms helping developers and businesses
              innovate.
            </p>
          </div>

          <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
            <div className="space-y-4">
              <div className="text-5xl font-bold">+1200</div>
              <p>Stars on GitHub</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">22 Million</div>
              <p>Active Users</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">+500</div>
              <p>Powered Apps</p>
            </div>
          </div>
        </div>
      </section>
      <Content2 />
      {/* <CallToAction /> */}
      {/* <FAQs />
      <Teams /> */}
    </>
  );
}
