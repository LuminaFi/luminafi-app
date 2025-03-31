export const Stats = () => (
  <section className="bg-zinc-50 py-12 md:py-20 dark:bg-zinc-900/50">
    <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
      <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
        <h2 className="text-4xl font-medium lg:text-5xl">
          Our Impact in Numbers
        </h2>
        <p>
          Explore the remarkable achievements and positive outcomes we've
          delivered through our innovative educational financing platform
        </p>
      </div>

      <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
        <div className="space-y-4">
          <div className="text-5xl font-bold">1,200+</div>
          <p>Active Student Profiles</p>
        </div>
        <div className="space-y-4">
          <div className="text-5xl font-bold">$4.2 Million</div>
          <p>Total Funded Education</p>
        </div>
        <div className="space-y-4">
          <div className="text-5xl font-bold">94%</div>
          <p>Completion Rate</p>
        </div>
      </div>
    </div>
  </section>
);
