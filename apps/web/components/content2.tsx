import Image from 'next/image';
import { useState } from 'react';

const testimonials = [
  {
    name: 'John K.',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40',
    quote:
      "LuminaFi helped me complete my computer science degree when traditional loans weren't an option. Now I'm working as a developer and repaying my backers.",
  },
  {
    name: 'Maria S.',
    role: 'Investor',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    quote:
      'I invested in 12 students last year through LuminaFi. Seeing them succeed gives me both financial returns and the satisfaction of making education accessible.',
  },
  {
    name: 'Sarah L.',
    role: 'Data Scientist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    quote:
      "The peer-to-peer funding model made my dreams possible. I'm now working in AI research and mentoring other students on LuminaFi.",
  },
];

export default function Content2() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-4xl font-bold mb-12 lg:text-5xl text-white">
          Education Success Stories
        </h2>

        <div className="relative">
          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 color-white rounded-full shadow-lg hover:color-gray-500"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 color-white rounded-full shadow-lg hover:color-gray-500"
          >
            →
          </button>

          {/* Testimonial Card */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl p-8 shadow-xl border border-gray-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonials?.[currentSlide]?.image as string}
                    alt={testimonials?.[currentSlide]?.name as string}
                    width={64}
                    height={64}
                    className="object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-xl text-gray-300">
                    {testimonials?.[currentSlide]?.name as string}
                  </h3>
                  <p className="text-gray-400">
                    {testimonials?.[currentSlide]?.role as string}
                  </p>
                </div>
              </div>
              <blockquote className="text-lg italic text-white">
                "{testimonials?.[currentSlide]?.quote as string}"
              </blockquote>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`cursor-pointer h-2 w-2 rounded-full ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-gray-600 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
