import Image from "next/image";

function page() {
  return (
    <div>
      <section>
        <div className="container p-6 py-20 mx-auto rounded lg:px-8 ">
          <h2 className="text-5xl font-bold text-center">
            Our team is here to help you.
          </h2>
          <div className="flex justify-center p-4">
            <a rel="noopener noreferrer" href="#">
              Meet our crew &gt;
            </a>
          </div>
          <Image
            src={`https://source.unsplash.com/random/360x240`}
            alt="img"
            width={1000}
            height={1000}
            className="object-cover w-full h-auto mt-8 rounded max-h-96 "
          />
        </div>
      </section>
    </div>
  );
}

export default page;
