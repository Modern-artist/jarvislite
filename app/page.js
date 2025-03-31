'use client'

import React from 'react'
import dynamic from 'next/dynamic';

// import Hero from '@/components/Hero'
const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
});

const page = () => {
  return (
    <div className=''>
      <Hero />
    </div>
  )
}

export default page