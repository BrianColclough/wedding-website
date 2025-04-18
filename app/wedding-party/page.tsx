export default function WeddingParty() {
  // Placeholder data - replace with actual wedding party details
  const bridesmaids = [
    {
      name: "Jane Smith",
      role: "Maid of Honor",
      relation: "Sister of the Bride",
      image: "/placeholder-woman.jpg",
    },
    {
      name: "Emma Johnson",
      role: "Bridesmaid",
      relation: "Friend of the Bride",
      image: "/placeholder-woman.jpg",
    },
    {
      name: "Sophie Williams",
      role: "Bridesmaid",
      relation: "College Roommate",
      image: "/placeholder-woman.jpg",
    },
  ];

  const groomsmen = [
    {
      name: "John Doe",
      role: "Best Man",
      relation: "Brother of the Groom",
      image: "/placeholder-man.jpg",
    },
    {
      name: "Michael Brown",
      role: "Groomsman",
      relation: "Friend of the Groom",
      image: "/placeholder-man.jpg",
    },
    {
      name: "David Wilson",
      role: "Groomsman",
      relation: "Childhood Friend",
      image: "/placeholder-man.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Wedding Party
      </h1>

      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Bridesmaids
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bridesmaids.map((person, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-pink-100 h-48 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center text-pink-500">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{person.name}</h3>
                  <p className="text-pink-500 font-medium">{person.role}</p>
                  <p className="text-gray-600 text-sm">{person.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">Groomsmen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groomsmen.map((person, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-blue-100 h-48 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-500">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{person.name}</h3>
                  <p className="text-blue-500 font-medium">{person.role}</p>
                  <p className="text-gray-600 text-sm">{person.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
