const FAQsContainer = () => {
  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently <br className="hidden lg:block" /> Asked{' '}
              <br className="hidden lg:block" />
              Questions
            </h2>
            <p>Common questions about our edu-financing platform</p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            <div className="pb-6">
              <h3 className="font-medium">How does EduChain funding work?</h3>
              <p className="text-muted-foreground mt-4">
                EduChain connects students directly with investors through our
                blockchain platform. We offer zero-interest funding with
                transparent terms and conditions.
              </p>

              <ol className="list-outside list-decimal space-y-2 pl-4">
                <li className="text-muted-foreground mt-4">
                  Submit your academic credentials and funding requirements
                </li>
                <li className="text-muted-foreground mt-4">
                  Get matched with potential investors
                </li>
                <li className="text-muted-foreground mt-4">
                  Receive funding directly through our secure blockchain
                  platform
                </li>
              </ol>
            </div>
            <div className="py-6">
              <h3 className="font-medium">
                What are the eligibility requirements?
              </h3>
              <p className="text-muted-foreground mt-4">
                To be eligible for funding, you must be enrolled or accepted
                into an accredited educational institution and meet our basic
                verification requirements.
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-medium">How is repayment structured?</h3>
              <p className="text-muted-foreground my-4">
                Our repayment system is flexible and based on your future income
                after graduation.
              </p>
              <ul className="list-outside list-disc space-y-2 pl-4">
                <li className="text-muted-foreground">
                  Zero interest on the principal amount
                </li>
                <li className="text-muted-foreground">
                  Income-based repayment plans start after graduation
                </li>
                <li className="text-muted-foreground">
                  All terms are transparently recorded on the blockchain
                </li>
              </ul>
            </div>
            <div className="py-6">
              <h3 className="font-medium">How is my data protected?</h3>
              <p className="text-muted-foreground mt-4">
                Your personal and financial information is secured using
                blockchain technology. We use advanced encryption and
                decentralized storage to ensure your data remains private and
                tamper-proof.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQsContainer;
