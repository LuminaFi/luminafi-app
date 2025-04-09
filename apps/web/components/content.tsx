import { Cpu, Zap } from 'lucide-react';
import Image from 'next/image';

export default function Content() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          The LuminaFi Ecosystem
        </h2>
        <div className="relative">
          <div className="relative z-10 space-y-4 md:w-1/2">
            <p className="text-body">
              LuminaFi is revolutionizing education financing through blockchain
              technology. Our platform connects ambitious students with
              forward-thinking investors,{' '}
              <span className="text-title font-medium">
                creating a transparent and efficient{' '}
              </span>
              marketplace — for educational funding.
            </p>
            {/* <p>
              It supports an entire ecosystem — from products to the APIs and
              platforms helping developers and businesses innovate
            </p> */}

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">For Students</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  <ol>
                    <li>1. Create your educational profile and verification</li>
                    <li>2. Apply for funding with your study plan</li>
                    <li>3. Receive funds in stable USDC</li>
                    <li>4. Focus on your education</li>
                    <li>5. Share progress with your backers</li>
                    <li>6. Repay through our fair profit-sharing model</li>
                  </ol>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4" />
                  <h3 className="text-sm font-medium">For Investors</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  <ol>
                    <li>1. Browse verified student credentials </li>
                    <li>2. Support promising educational journeys</li>
                    <li>3. Track academic progress transparently </li>
                    <li>4. Receive returns based on successful outcomes </li>
                    <li>5. Build a diverse education investment portfolio</li>
                    <li>6. Participate in governance decisions</li>
                  </ol>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
            <div
              aria-hidden
              className="bg-linear-to-l z-1 to-background absolute inset-0 hidden from-transparent to-55% md:block"
            ></div>
            <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
              <Image
                src="/charts.png"
                className="hidden rounded-[12px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/charts-light.png"
                className="rounded-[12px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
