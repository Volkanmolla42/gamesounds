export default function UseCases() {
  const useCases = [
    {
      title: 'Game Development',
      description: 'Perfect for indie game developers who need custom sound effects',
      icon: '🎮'
    },
    {
      title: 'Video Production',
      description: 'Enhance your videos with unique, high-quality sound effects',
      icon: '🎬'
    },
    {
      title: 'Podcasting',
      description: 'Add immersive sound effects to your podcasts',
      icon: '🎙️'
    },
    {
      title: 'Mobile Apps',
      description: 'Create custom notification and interaction sounds',
      icon: '📱'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
              <p className="text-gray-300">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
