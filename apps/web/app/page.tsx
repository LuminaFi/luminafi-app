'use client';

import { useOCAuth } from '@opencampus/ocid-connect-js';
import dynamic from 'next/dynamic';
import React from 'react';

import Features from '~/components/feature';
import Content from '~/components/content';
import Content2 from '~/components/content2';
import { Stats } from '~/components/stats';
import { Loading } from '~/components/loading';

const Home = dynamic(() => import('../container/home/Home.container'), {
  ssr: false,
});

export default function HomePage() {
  const { authState } = useOCAuth();

  if (authState?.error) {
    return <div>Error: {authState.error.message}</div>;
  }

  if (authState?.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Home />
      <Features />
      <Content />
      <Stats />
      <Content2 />
    </>
  );
}
