import Image from 'next/image'

export default function LatestNews() {
  const latestNews = [
    {
      title: "New Sound Categories Added",
      date: "March 1, 2025",
      summary: "We've added 5 new sound categories including Retro Gaming and Cyberpunk effects.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "Mobile App Coming Soon",
      date: "February 15, 2025",
      summary: "Our mobile app for iOS and Android is in final testing and will be released next month.",
      image: "https://images.unsplash.com/photo-1605170439002-90845e8c0137?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      title: "AI Engine Upgrade",
      date: "January 30, 2025",
      summary: "We've upgraded our AI engine for faster and more realistic sound generation.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Latest Updates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {latestNews.map((news, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-60 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="text-sm text-purple-400 mb-2">{news.date}</div>
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-gray-300">{news.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
