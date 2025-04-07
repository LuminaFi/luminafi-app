import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import Link from 'next/link';

const ContactContainer = () => {
  return (
    <main>
      <section className="py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-0">
          <h1 className="mb-12 text-center text-4xl font-semibold lg:text-5xl">
            Get in Touch with EduChain
          </h1>

          <div className="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
            <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
              <div>
                <h2 className="mb-3 text-lg font-semibold">For Students</h2>
                <Link
                  href="mailto:students@educhain.io"
                  className="text-lg text-blue-600 hover:underline dark:text-blue-400"
                >
                  students@educhain.io
                </Link>
                <p className="mt-3 text-sm">Support for funding applications</p>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
              <div>
                <h2 className="mb-3 text-lg font-semibold">For Investors</h2>
                <Link
                  href="mailto:investors@educhain.io"
                  className="text-lg text-blue-600 hover:underline dark:text-blue-400"
                >
                  investors@educhain.io
                </Link>
                <p className="mt-3 text-sm">Investment opportunities</p>
              </div>
            </div>
          </div>

          <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>
          <form action="" className="border px-4 py-12 lg:px-0 lg:py-24">
            <Card className="mx-auto max-w-lg p-8 sm:p-16">
              <h3 className="text-xl font-semibold">
                Tell us about your interests
              </h3>
              <p className="mt-4 text-sm">
                Whether you're a student seeking funding or an investor looking
                to support education, we're here to help connect you with the
                right opportunities.
              </p>

              <div className="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
                <div>
                  <Label htmlFor="name" className="space-y-2">
                    Full Name
                  </Label>
                  <Input type="text" id="name" required />
                </div>
                <div>
                  <Label htmlFor="email" className="space-y-2">
                    Email Address
                  </Label>
                  <Input type="email" id="email" required />
                </div>
                <div>
                  <Label htmlFor="role" className="space-y-2">
                    I am a
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="institution">
                        Educational Institution
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="institution" className="space-y-2">
                    Institution Name
                  </Label>
                  <Input type="text" id="institution" />
                </div>
                <div>
                  <Label htmlFor="interest" className="space-y-2">
                    Area of Interest
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funding">Student Funding</SelectItem>
                      <SelectItem value="investing">
                        Investment Opportunities
                      </SelectItem>
                      <SelectItem value="partnership">
                        Institution Partnership
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="msg" className="space-y-2">
                    Message
                  </Label>
                  <Textarea
                    id="msg"
                    rows={3}
                    placeholder="Tell us more about your educational goals or investment interests"
                  />
                </div>
                <Button>Submit Inquiry</Button>
              </div>
            </Card>
          </form>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-lg font-medium">
            Trusted by Leading Educational Institutions
          </h2>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 sm:gap-x-16 sm:gap-y-14">
            <div className="flex">
              <Image
                className="mx-auto h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                alt="Nvidia Logo"
                height="20"
                width="20"
                priority
              />
            </div>

            <div className="flex">
              <Image
                className="mx-auto h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/column.svg"
                alt="Column Logo"
                height="16"
                width="16"
                priority
              />
            </div>
            <div className="flex">
              <Image
                className="mx-auto h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/github.svg"
                alt="GitHub Logo"
                height="16"
                width="16"
                priority
              />
            </div>
            <div className="flex">
              <Image
                className="mx-auto h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/nike.svg"
                alt="Nike Logo"
                height="20"
                width="20"
                priority
              />
            </div>
            <div className="flex">
              <Image
                className="mx-auto h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                alt="Lemon Squeezy Logo"
                height="20"
                width="20"
                priority
              />
            </div>
            <div className="flex">
              <Image
                className="mx-auto h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/laravel.svg"
                alt="Laravel Logo"
                height="16"
                width="16"
                priority
              />
            </div>
            <div className="flex">
              <Image
                className="mx-auto h-7 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/lilly.svg"
                alt="Lilly Logo"
                height="28"
                width="28"
                priority
              />
            </div>

            <div className="flex">
              <Image
                className="mx-auto h-6 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/openai.svg"
                alt="OpenAI Logo"
                height="24"
                width="24"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactContainer;
