import Link from 'next/link';
import { Button } from '~/components/ui/button';
import Image from 'next/image';
import { LogoStroke } from '~/components/logo';

const members = [
  {
    name: 'Nashir Jamali',
    role: 'Blockchain Developer',
    bio: 'Expert in smart contract development and blockchain infrastructure with focus on educational DeFi solutions',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'Adam Afriansyah Brahmana',
    role: 'Blockchain Developer',
    bio: 'Specialized in Layer 3 solutions and cross-chain interoperability for decentralized education financing',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'Teguh Maulana',
    role: 'Frontend / Backend Developer',
    bio: 'Full-stack developer with expertise in building secure and scalable educational platforms',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'Muhammad Faiz Noeris',
    role: 'Frontend Developer',
    bio: 'UI/UX specialist focused on creating intuitive interfaces for blockchain-based educational applications',
    avatar: 'https://avatars.githubusercontent.com/u/16839233?v=4',
    link: '#',
  },
];

const AboutContainer = () => {
  return (
    <main>
      <section className="pt-16 md:pt-32">
        <div aria-hidden>
          <div className="bg-linear-to-t from-background -z-9 absolute inset-x-0 top-0 h-2/3 max-h-96 to-transparent"></div>
          <div className="absolute top-0 -z-10 h-2/3 max-h-96 w-full bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] bg-[size:56px_56px] opacity-45"></div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pt-32 lg:px-0">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-balance text-center text-4xl font-medium lg:text-7xl">
              Revolutionizing Education Finance
            </h1>
            <p>
              EduChain is building a decentralized future where every student
              has access to transparent, interest-free education financing
              through blockchain technology.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-8 text-4xl font-medium md:mb-16">Our Mission</h2>
          <div
            aria-hidden
            className="relative -mx-4 mb-8 aspect-video md:mb-16"
          >
            <div className="bg-background absolute inset-0 m-auto size-fit p-8">
              <LogoStroke className="h-fit w-20 text-blue-500" />
            </div>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          <div className="space-y-6">
            <p className="text-accent-foreground">
              We're on a mission to democratize education financing by
              connecting students directly with investors through blockchain
              technology.
            </p>
            <p className="mt-4">
              Traditional student loans often come with high interest rates and
              complex terms. Through{' '}
              <span className="font-bold">EduChain's Layer 3 solution</span>,
              we're creating a transparent, zero-interest funding platform that
              benefits both students and investors.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-lg px-6 lg:px-0">
          <h2 className="mb-8 text-4xl font-medium md:mb-16">Our Team</h2>

          <div>
            <h3 className="mb-6 text-lg font-medium">Leadership</h3>
            <div className="grid grid-cols-2 gap-8 border-t py-6 md:grid-cols-2">
              {members.map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-background size-20 rounded-full border p-0.5 shadow">
                    <Image
                      className="aspect-square rounded-full object-cover"
                      src={member.avatar}
                      alt={member.name}
                      height="460"
                      width="460"
                      loading="lazy"
                    />
                  </div>
                  <span className="block text-lg font-medium">
                    {member.name}
                  </span>
                  <span className="text-muted-foreground block text-sm">
                    {member.role}
                  </span>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              Join the Education Revolution
            </h2>
            <p className="mt-4">
              Whether you're a student seeking funding or an investor looking to
              make an impact
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/apply">
                  <span>Apply for Funding</span>
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/register">
                  <span>Become an Investor</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutContainer;
