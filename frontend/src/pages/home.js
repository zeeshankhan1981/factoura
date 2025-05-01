import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample articles to display if API fails
  const sampleArticles = [
    {
      id: 1,
      title: "Blockchain Verification: The Future of Trustworthy Journalism",
      authorName: "Elena Rodriguez",
      createdAt: new Date("2025-01-15"),
      content: "In an era where misinformation spreads rapidly across digital platforms, blockchain verification offers a promising solution for establishing the authenticity of journalistic content. By creating an immutable record of each article's creation, edits, and sources, blockchain technology enables readers to trace the lineage of information they consume. This transparency builds trust between publishers and their audience, a crucial commodity in today's media landscape. At factoura., we implement Polygon PoS blockchain to certify all published stories, ensuring that each piece of content carries verifiable credentials. This approach not only validates the integrity of our journalism but also creates a permanent archive that cannot be altered or erased by external pressures. As news organizations worldwide grapple with declining public trust, blockchain verification stands as a technological bulwark against the erosion of journalistic credibility.",
      tags: ["blockchain", "verification", "trust"]
    },
    {
      id: 2,
      title: "Collaborative Journalism: How Crowdsourcing Transforms Reporting",
      authorName: "Marcus Chen",
      createdAt: new Date("2025-02-03"),
      content: "The traditional model of journalism—where individual reporters work in isolation to develop stories—is giving way to more collaborative approaches. Crowdsourced journalism harnesses the collective intelligence of diverse contributors, leading to more comprehensive and nuanced reporting. This democratized approach to news gathering brings multiple perspectives to complex issues, often uncovering angles that might be missed by a single journalist. factoura.'s platform exemplifies this shift by creating an ecosystem where professional journalists, subject matter experts, and engaged citizens can collaborate on investigative projects. By distributing the workload across a network of contributors, we're able to tackle stories with greater depth and breadth than traditional newsrooms. The result is journalism that reflects a multiplicity of voices and experiences, providing readers with a more complete picture of the issues that matter.",
      tags: ["collaboration", "crowdsourcing", "investigation"]
    },
    {
      id: 3,
      title: "Protecting Sources in the Digital Age: New Approaches to Journalistic Ethics",
      authorName: "Sophia Washington",
      createdAt: new Date("2025-02-18"),
      content: "As digital surveillance becomes increasingly sophisticated, journalists face unprecedented challenges in protecting their sources. Traditional methods of source protection are often insufficient against advanced tracking technologies and data collection practices. This new reality demands innovative approaches to maintaining the confidentiality that is essential for investigative journalism to function. factoura. has developed a comprehensive security protocol that combines technical safeguards with ethical guidelines to protect vulnerable sources. Our platform utilizes end-to-end encryption, secure drop systems, and anonymous contribution channels to ensure that whistleblowers and informants can share critical information without exposing themselves to retaliation. Beyond technical solutions, we're also advancing the conversation around journalistic ethics in the digital age, advocating for stronger legal protections and industry standards that recognize the evolving nature of source relationships.",
      tags: ["ethics", "source protection", "security"]
    },
    {
      id: 4,
      title: "Community Fact-Checking: Distributed Verification for the Information Age",
      authorName: "Jamal Ibrahim",
      createdAt: new Date("2025-03-01"),
      content: "The overwhelming volume of information circulating online has outpaced traditional fact-checking methods, creating an opportunity for community-driven verification processes. By distributing the responsibility of fact-checking across a network of trained contributors, we can scale verification efforts to match the pace of modern information flow. factoura.'s community fact-checking initiative engages qualified volunteers who apply rigorous standards to verify claims within their areas of expertise. This distributed approach not only increases our capacity to validate information but also builds media literacy among participants. Each fact-check undergoes multiple reviews before being certified on our platform, ensuring accuracy while maintaining efficiency. As misinformation becomes more sophisticated, our collective approach to verification provides a robust defense against false narratives, leveraging the specialized knowledge of community members to evaluate complex claims across diverse subject areas.",
      tags: ["fact-checking", "community", "verification"]
    },
    {
      id: 5,
      title: "Transparency in Reporting: Opening the Black Box of Journalism",
      authorName: "Aisha Patel",
      createdAt: new Date("2025-03-10"),
      content: "Traditional journalism has often operated as a black box, with readers receiving finished stories but having little insight into how they were produced. This opacity has contributed to public skepticism about media bias and accuracy. By contrast, transparent journalism invites readers into the reporting process, documenting the methods, sources, and decision-making that shape each story. At factoura., transparency is a core principle embedded in our platform's design. Each article includes a visibility log that details the research process, interview transcripts (where permission is granted), and editorial decisions that influenced the final piece. This radical transparency allows readers to evaluate the quality of evidence for themselves rather than simply trusting the journalist's conclusions. By making our processes visible, we're fostering a more informed and discerning audience while holding our contributors to higher standards of rigor and accountability.",
      tags: ["transparency", "methodology", "trust"]
    }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/articles');
        if (response.data && response.data.length > 0) {
          setArticles(response.data);
        } else {
          // If no articles returned, use sample articles
          setArticles(sampleArticles);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to fetch articles. Using sample content instead.");
        // Use sample articles as fallback
        setArticles(sampleArticles);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-primary-darker text-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl font-bold">factoura.</h1>
            <p className="text-sm text-gray-200 italic">Digital journalism on the blockchain</p>
          </Link>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <li><a href="#how-it-works" className="text-gray-200 hover:text-white transition-colors duration-200">How It Works</a></li>
              <li><a href="#featured" className="text-gray-200 hover:text-white transition-colors duration-200">Featured Stories</a></li>
              <li><a href="#about" className="text-gray-200 hover:text-white transition-colors duration-200">About</a></li>
              <li className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                <Link to="/login" className="px-4 py-2 border border-white text-white hover:bg-white hover:text-primary-darker rounded-md text-center transition-colors duration-200">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-white text-primary-darker hover:bg-gray-200 rounded-md text-center transition-colors duration-200">Sign Up</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-light to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Uncovering Truth Through Collaboration</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">factoura. leverages blockchain technology and community-driven reporting to provide verified, transparent journalism.</p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/signup" className="px-8 py-3 bg-white text-primary-darker font-semibold rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200">Become a Contributor</Link>
            <a href="#featured" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-primary-darker transition-colors duration-200">Read Stories</a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How factoura. Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-light text-primary-darker rounded-full mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Collaborative Reporting</h3>
              <p className="text-gray-600">Journalists and contributors work together to research and develop stories.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-light text-primary-darker rounded-full mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Rigorous Verification</h3>
              <p className="text-gray-600">Facts and sources are thoroughly checked and verified by the community.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-light text-primary-darker rounded-full mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Blockchain Certification</h3>
              <p className="text-gray-600">Verified stories are recorded on the Polygon blockchain for permanent transparency.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-primary-light text-primary-darker rounded-full mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Public Access</h3>
              <p className="text-gray-600">Stories are made available to the public with full transparency about sources and methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section id="featured" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Featured Stories</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">A selection of our top verified stories. Log in to access our full library of content.</p>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            </div>
          ) : error ? (
            <div className="mb-8">
              <p className="text-red-500 text-center mb-8">{error}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleArticles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{article.title}</h3>
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified on Blockchain</span>
                      </div>
                      <div className="mb-4 text-sm text-gray-600">
                        <span>By {article.authorName}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {article.content.length > 150 
                          ? `${article.content.substring(0, 150)}...` 
                          : article.content}
                      </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="space-x-2">
                          {article.tags && article.tags.map((tag, idx) => (
                            <span key={idx} className="inline-block text-xs text-gray-600">#{tag}</span>
                          ))}
                        </div>
                        <Link to={`/article/${article.id}`} className="text-primary-dark hover:text-primary-darker font-medium text-sm">
                          Read Full Story →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{article.title}</h3>
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified on Blockchain</span>
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                      <span>By {article.authorName || 'Anonymous'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {article.content && article.content.length > 150 
                        ? `${article.content.substring(0, 150)}...` 
                        : article.content || 'No content available'}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        {article.tags && article.tags.map((tag, idx) => (
                          <span key={idx} className="inline-block text-xs text-gray-600">#{tag}</span>
                        ))}
                      </div>
                      <Link to={`/article/${article.id}`} className="text-primary-dark hover:text-primary-darker font-medium text-sm">
                        Read Full Story →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/signup" className="inline-block px-6 py-3 bg-primary-dark text-white font-medium rounded-md hover:bg-primary-darker transition-colors duration-200">
              Join factoura. for Full Access
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">About factoura.</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-6">
              factoura. is a journalism platform built on the core principles of transparency, collaboration, and verification. We're revolutionizing how news is produced and consumed by bringing together journalists, fact-checkers, and readers in a community dedicated to uncovering truth.
            </p>
            <p className="text-gray-600 mb-6">
              Our blockchain verification system ensures that every published story has undergone rigorous fact-checking and that all steps in the verification process are permanently recorded. This creates an immutable record of journalistic work that builds trust through transparency.
            </p>
            <p className="text-gray-600">
              Join us in our mission to restore trust in journalism through technological innovation and community collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">factoura.</h2>
              <p className="text-gray-400">Digital journalism on the blockchain</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2">Navigation</h3>
                <ul className="space-y-2">
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-200">How It Works</a></li>
                  <li><a href="#featured" className="text-gray-400 hover:text-white transition-colors duration-200">Featured Stories</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Account</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Login</Link></li>
                  <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors duration-200">Sign Up</Link></li>
                  <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm"> 2025 factoura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
