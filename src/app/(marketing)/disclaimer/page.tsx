const Disclaimer = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-96 relative mx-auto pb-10 text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-4xl">DISCLAIMER</h1>
          <p className="mb-4 text-sm sm:text-base">
            Effective Date: June 01, 2024
          </p>
        </div>
      </div>
      <div className="relative px-4 sm:px-16">
        <div className="prose text-gray-800 dark:text-white">
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white ">
            1. General Information
          </h2>
          <p className="mb-4">
            The information provided by Tr Forms Factory on this website is for
            general informational purposes only. All information on the site is
            provided in good faith; however, we make no representation or
            warranty of any kind, express or implied, regarding the accuracy,
            adequacy, validity, reliability, availability, or completeness of
            any information on the site.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white ">
            2. Professional Advice
          </h2>
          <p className="mb-4">
            The services provided by Tr Forms Factory, including the creation of
            forms, APIs, and webhooks, do not constitute legal, medical,
            financial, or other professional advice. Users are advised to seek
            the advice of qualified professionals before making any decisions
            based on the information provided by our services.{" "}
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            3. Third-Party Links
          </h2>
          <p className="mb-4">
            The site may contain links to third-party websites or content. Such
            links are provided for your convenience only, and ThinkRoman
            Ventures LLP does not endorse or assume any responsibility for any
            such third-party sites, information, materials, products, or
            services.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p className="mb-4">
            Under no circumstance shall ThinkRoman Ventures LLP be liable to you
            for any loss or damages of any kind incurred as a result of the use
            of the site or reliance on any information provided on the site.
            Your use of the site and your reliance on any information on the
            site is solely at your own risk.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            5. Changes and Updates
          </h2>
          <p className="mb-4">
            We reserve the right to make additions, deletions, or modifications
            to the content on this site at any time without prior notice.
            However, we do not make any commitment to update the information.
          </p>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            6. Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions about this Disclaimer, please contact us
            at admin@thinkroman.com or via WhatsApp at +018169197853
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
