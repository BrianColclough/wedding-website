export default function WeddingParty() {
  // Placeholder data - replace with actual wedding party details
  const bridesmaids = [
    {
      name: "Oliva Rogers",
      role: "Maid of Honor",
      relation: "Sister of the Bride",
      image: "/placeholder-woman.jpg",
    },
    {
      name: "Brielle Smith",
      role: "Bridesmaid",
      relation: "Sister of the Bride",
      image: "/placeholder-woman.jpg",
    },
    {
      name: "Meredith Wilson",
      role: "Bridesmaid",
      relation: "Something",
      image: "/placeholder-woman.jpg",
    },
  ];

  const groomsmen = [
    {
      name: "Chris Colclough",
      role: "Best Man",
      relation: "Brother of the Groom",
      image: "/placeholder-man.jpg",
    },
    {
      name: "Patrick Winner",
      role: "Groomsman",
      relation: "Brother of the Bride",
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
          <h2 className="text-2xl text-periwinkle-300 font-semibold text-center mb-6">
            Bridesmaids
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bridesmaids.map((person, index) => (

              <div
                key={index}
                className="relative group"
              >
                <h3 className="font-serif font-semibold text-2xl relative inline-block translate-y-4 translate-x-3 px-1 bg-black z-10">{person.name}</h3>
                <div className="h-56 border-2 border-dashed border-periwinkle-300 rounded-lg flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <div className="px-6 py-2 text-right relative">
                  <p className="text-periwinkle-500 font-medium text-lg mt-2">{person.role}</p>
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
                className="relative group"
              >
                <h3 className="font-serif font-semibold text-2xl relative inline-block translate-y-4 translate-x-3 px-1 bg-black z-10">{person.name}</h3>
                <div className="h-48 border-2 border-blue-200 border-dashed rounded-lg flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-500">
                    {person.name.charAt(0)}
                  </div>
                </div>
                <div className="px-6 py-2 text-right relative">
                  <p className="text-blue-500 font-medium text-lg mt-2">{person.role}</p>
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
