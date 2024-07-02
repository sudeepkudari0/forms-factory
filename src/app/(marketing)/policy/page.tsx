const Policy = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-96 relative mx-auto pb-10 text-center">
          <h1 className="mb-2 text-2xl font-bold text-primary sm:text-4xl">
            PRIVACY POLICY
          </h1>
          <p className="mb-4 text-sm text-primary sm:text-base">
            Effective Date: June 01, 2024
          </p>
        </div>
      </div>
      <div className="relative px-4 sm:px-16 lg:px-64">
        <div className="prose">
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white ">
            1. Information Collection
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you
            create an account, fill out a form, or communicate with us. This may
            include your name, email address, phone number, and other contact
            details.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white ">
            2. Use of Information
          </h2>
          <p className="mb-4">We use the information we collect to: </p>
          <ul className="mb-4 list-disc">
            <li className="mb-2 ml-8">
              Provide, maintain, and improve our services.
            </li>
            <li className="mb-2 ml-8">
              Communicate with you, respond to your inquiries, and send you
              updates.
            </li>
            <li className="mb-2 ml-8">
              Monitor and analyze trends, usage, and activities in connection
              with our services.
            </li>
          </ul>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            3. Sharing of Information
          </h2>
          <p className="mb-4">
            We do not share your personal information with third parties except
            as necessary to provide our services or comply with the law.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            4. Security
          </h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, and unauthorized access, disclosure,
            alteration, and destruction.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            5. Your Choices
          </h2>
          <p className="mb-4">
            You may update or correct information about yourself at any time by
            logging into your account. You may also opt-out of receiving
            promotional communications from us by following the instructions in
            those communications.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            6. Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at admin@thinkroman.com or via WhatsApp at +018169197853.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
