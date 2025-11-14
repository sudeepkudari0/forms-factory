import Link from "next/link";

const Contact = () => {
  return (
    <div className="flex min-h-[calc(100vh-12vh)] md:min-h-[calc(100vh-10vh)] flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold text-primary sm:text-4xl">
        CONTACT US
      </h1>
      <div className="mb-4 text-sm text-blue-500 sm:text-base">
        <Link
          target="_blank"
          href="https://sudeepkudari.online/"
          className="text-blue-500 hover:text-blue-700"
        >
          www.sudeepkudari.online
        </Link>
      </div>
      <div className="mb-4 text-sm text-primary sm:text-base">
        Email:{" "}
        <Link
          href="mailto:sudeepkudari0@gmail.com"
          className="text-blue-500 hover:text-blue-700"
        >
          sudeepkudari0@gmail.com
        </Link>
      </div>
      <p className="mb-4 text-sm text-primary sm:text-base">
        Phone:{" "}
        <span className="text-blue-500 hover:text-blue-700">
          +91 8618078136
        </span>
      </p>
    </div>
  );
};

export default Contact;
