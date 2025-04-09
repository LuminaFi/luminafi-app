'use client';

import { useState } from 'react';
import { FileText, UserCircle } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

const navigation = [
  { name: 'Profile', icon: UserCircle },
  { name: 'Credentials', icon: FileText },
];

const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState<string>('Profile');

  return (
    <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      <div className="flex flex-1 justify-center">
        <div className="flex flex-row gap-10 relative w-[50%] self-center">
          <div className="w-48 border-r-zinc-50 border-r left-0">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm rounded-md relative cursor-pointer',
                      'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      isActive && 'font-medium text-primary',
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                    {isActive && (
                      <span className="absolute left-0 w-1 h-full bg-primary rounded-r-md" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {activeTab === 'Profile' ? (
            <div className="w-full">
              <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
                Profile
              </h1>
            </div>
          ) : null}
          {activeTab === 'Credentials' ? (
            <div className="w-full">
              <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
                Credentials
              </h1>

              // TODO: show credentials data from BE
              <h2>Education Credential</h2>
              <Button>Download Credentials</Button>

              <h2 className="mt-4">Description</h2>
              <p className="text-sm text-muted-foreground mb-4">
                I have always been fascinated by how technology shapes our
                world. From everyday conveniences to groundbreaking innovations,
                the field of computer science continues to redefine what is
                possible. This passion has motivated me to pursue a Bachelor’s
                degree in Computer Science at the University of Pennsylvania, a
                world-renowned institution that offers rigorous academic
                training and a vibrant, diverse community. I believe UPenn’s
                interdisciplinary approach, cutting-edge research opportunities,
                and strong emphasis on innovation perfectly align with my
                aspirations to become a skilled and impactful computer
                scientist. My dream is to not only master the core concepts of
                computing, but also to apply them in meaningful ways—whether by
                building scalable software, advancing artificial intelligence,
                or contributing to solutions that address real-world problems in
                education, healthcare, or sustainability. I am especially drawn
                to UPenn’s collaborative environment, where students are
                encouraged to think critically, work on impactful projects, and
                learn beyond the classroom. However, pursuing higher education
                in the United States comes with significant financial
                challenges. As someone from a modest background, I am actively
                seeking financial support to help make this dream a reality. I
                am fully committed to working hard and making the most of the
                opportunities provided to me. With the right support, I am
                confident that I can thrive academically and contribute
                meaningfully to the UPenn community. Investing in my education
                is not only an investment in my future but also in the positive
                impact I aim to make in the world through technology. I am
                hopeful that with financial assistance, I can join the
                University of Pennsylvania and begin my journey toward becoming
                a computer scientist who drives innovation and creates value for
                society.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DashboardContainer;
