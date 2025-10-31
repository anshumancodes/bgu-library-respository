export default function Footer() {
  return (
    <footer className="footer border-t border-gray-200 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Grid sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* About section */}
          <div>
            <h3 className="text-gray-200 font-semibold text-lg mb-2">
              About Repository
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Birla Global University's institutional repository preserves and
              shares the scholarly works of students and faculty, ensuring
              long-term accessibility and visibility.
            </p>
          </div>

          {/* Support section */}
          <div>
            <h3 className="text-gray-200 font-semibold text-lg mb-2">
              Support
            </h3>
            <p className="text-gray-500">
              For queries, contact:
              <br />
              <a
                href="mailto:library@bgu.ac.in"
                className="text-gray-200 hover:underline"
              >
                library@bgu.ac.in
              </a>
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col sm:flex-row gap-50 items-center border-t border-gray-200 pt-6 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} Birla Global University. Powered by{" "}
            <span className="text-gray-200 font-medium">DSpace API + React </span>
          </span>
          <span className="mt-2 sm:mt-0">
            Developed & Maintained by{" "}
            <a
              href="https://www.linkedin.com/in/anshumancdx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:underline font-medium"
            >
              anshumancdx
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
