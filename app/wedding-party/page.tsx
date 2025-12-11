import Image from "next/image";

export default function WeddingParty() {
  // Placeholder data - replace with actual wedding party details
  const bridesmaids = [
    {
      name: "Olivia Rogers",
      role: "Maid of Honor",
      relation: "Sister of the Bride",
      image: "/wedding-party/Livy.jpg",
    },
    {
      name: "Brielle Smith",
      role: "Bridesmaid",
      relation: "Sister of the Bride",
      image: "/wedding-party/Brielle.jpg",
    },
    {
      name: "Meredith Wilson",
      role: "Bridesmaid",
      relation: "Sister of the Bride",
      image: "/wedding-party/Meredith.webp",
    },
    {
      name: "Lindsay McCoy",
      role: "Bridesmaid",
      relation: "Friend of the Bride",
      image: "/wedding-party/Lindsay.jpg",
    },
    {
      name: "Payton Kyzer",
      role: "Bridesmaid",
      relation: "Friend of the Bride",
      image: "/wedding-party/Payton.webp",
    },
  ];

  const groomsmen = [
    {
      name: "Chris Colclough",
      role: "Best Man",
      relation: "Brother of the Groom",
      image: "/wedding-party/Chris.jpg",
    },
    {
      name: "Patrick Winner",
      role: "Groomsman",
      relation: "Brother of the Bride",
      image: "/wedding-party/Patrick.webp",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <h1 className="mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        Wedding Party
      </h1>

      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-periwinkle-300/50"></div>
            <h2 className="text-3xl font-semibold text-periwinkle-300">
              Bridesmaids
            </h2>
            <div className="h-px w-12 bg-periwinkle-300/50"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bridesmaids.map((person, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center"
              >
                <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
                  {person.image ? (
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-600">
                      <span className="text-6xl font-thin opacity-20">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="mb-1 font-serif text-2xl font-medium tracking-wide text-white">
                    {person.name}
                  </h3>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wider text-periwinkle-400">
                    {person.role}
                  </p>
                  <p className="text-sm italic text-neutral-400">
                    {person.relation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-periwinkle-300/50"></div>
            <h2 className="text-3xl font-semibold text-periwinkle-300">
              Groomsmen
            </h2>
            <div className="h-px w-12 bg-periwinkle-300/50"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {groomsmen.map((person, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center"
              >
                <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
                  {person.image ? (
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-600">
                      <span className="text-6xl font-thin opacity-20">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="mb-1 font-serif text-2xl font-medium tracking-wide text-white">
                    {person.name}
                  </h3>
                  <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-400">
                    {person.role}
                  </p>
                  <p className="text-sm italic text-neutral-400">
                    {person.relation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
