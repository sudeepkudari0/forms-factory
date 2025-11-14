const Terms = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-96 relative mx-auto pb-10 text-center">
          <h1 className="mb-2 text-2xl font-bold text-primary sm:text-4xl">
            TERMS OF USE
          </h1>
          <p className="mb-4 text-sm text-primary sm:text-base">
            Effective Date: November 14, 2025
          </p>
        </div>
      </div>
      <div className="relative px-4 sm:px-16 lg:px-64">
        <div className="prose">
          <h2 className="mb-2 text-xl font-bold text-primary">
            1. ACCEPTANCE OF TERMS
          </h2>
          <p className="mb-4 text-primary">
            By accessing and using the Forms Factory website and services, you
            agree to comply with and be bound by these Terms of Use. If you do
            not agree to these terms, please do not use our services.
          </p>
          <h2 className="mb-2 text-xl font-bold text-primary">
            2. Description of Service
          </h2>
          <p className="mb-4 text-primary">
            Forms Factory provides users with the ability to create forms
            dynamically, generate APIs, share forms, and utilize webhooks. These
            services are provided "as is" and "as available" without any
            warranties of any kind.
          </p>
          <h2 className="mb-2 text-xl font-bold text-primary">
            3. User Responsibilities
          </h2>
          <p className="mb-4 text-primary">
            Users agree to use the services in compliance with all applicable
            laws and regulations. Users are responsible for maintaining the
            confidentiality of their account information and for all activities
            that occur under their account.
          </p>
          <h2 className="mb-2 text-xl font-bold text-primary">
            4. Prohibited Conduct
          </h2>
          <p className="mb-4 text-primary">Users shall not:</p>
          <ul className="mb-4 list-decimal">
            <li className="mb-2 ml-8 text-primary">
              Use the service for any illegal or unauthorized purposes.
            </li>
            <li className="mb-2 ml-8 text-primary">
              Disrupt or interfere with the security or operation of the
              service.
            </li>
            <li className="mb-2 ml-8 text-primary">
              Attempt to gain unauthorized access to the service or its related
              systems or networks.
            </li>
          </ul>
          <h2 className="mb-2 text-xl font-bold text-primary">
            5. Termination
          </h2>
          <p className="mb-4 text-primary">
            We reserve the right to terminate or suspend access to our services
            immediately, without prior notice or liability, for any reason,
            including without limitation if you breach the Terms.
          </p>
          <h2 className="mb-2 text-xl font-bold text-primary">
            6. Limitation of Liability
          </h2>
          <p className="mb-4 text-primary">
            In no event shall Forms Factory be liable for any indirect,
            incidental, special, consequential, or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the service.
          </p>
          <h2 className="mb-2 text-xl font-bold text-primary">
            7. Changes to Terms
          </h2>
          <p className="mb-4 text-primary">
            We reserve the right to modify or replace these Terms at any time.
            By continuing to access or use our service after those revisions
            become effective, you agree to be bound by the revised terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
