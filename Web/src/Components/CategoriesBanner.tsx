const cardsData = [
  {
    title: "Getting Started with React",
    author: "Sarah Johnson",
    date: "2024-10-01",
    imageWidth: 400,
    imageHeight: 250,
  },
  {
    title: "Modern Web Development",
    author: "Mike Chen",
    date: "2024-10-02",
    imageWidth: 400,
    imageHeight: 250,
  },
  {
    title: "Design Patterns in JS",
    author: "Emily Brown",
    date: "2024-10-03",
    imageWidth: 400,
    imageHeight: 250,
  },
  {
    title: "Web Accessibility Guide",
    author: "David Wilson",
    date: "2024-10-04",
    imageWidth: 400,
    imageHeight: 250,
  },
  {
    title: "CSS Best Practices",
    author: "Lisa Anderson",
    date: "2024-10-05",
    imageWidth: 400,
    imageHeight: 250,
  },
];

export default function HorizontalCards() {
  return (
    <div
      className="w-full min-h-screen bg-gray-50 py-8"
      style={{ backgroundColor: "white" }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Featured Articles
        </h1>

        <div className="grid grid-cols-5 gap-4">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={`/api/placeholder/${card.imageWidth}/${card.imageHeight}`}
                  alt={`${card.title} cover`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600">By {card.author}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(card.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
