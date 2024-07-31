import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

type Bird = {
  speciesCode: string;
  comName: string;
  sciName: string;
  howMany: number;
  locName: string;
  obsDt: string;
};

type FetchBirdImages = (birdName: string) => Promise<any>;

function BirdCard({ bird }: { bird: Bird }) {
  const formattedDate = format(parseISO(bird.obsDt), "d MMMM yyyy");
  const formattedTime = format(parseISO(bird.obsDt), "H:mm");

  const fetchBirdImages: FetchBirdImages = async (birdName) => {
    const apiKey = import.meta.env.VITE_API_KEY_FLICKR;
    const endpoint = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${encodeURIComponent(birdName)}-bird&format=json&nojsoncallback=1`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      const photos = data.photos.photo.map((photo: any) => ({
        url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`,
        ownerUrl: `https://www.flickr.com/photos/${photo.owner}`,
      }));
      const imagesData = [photos[0].url, photos[0].ownerUrl];
      return imagesData;
    } catch (error) {
      console.error("Error fetching images from Flickr:", error);
      return [];
    }
  };

  // const fetchBirdSounds: any = async (birdName: any) => {
  //   const response = await fetch(
  //     `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(
  //       birdName
  //     )}`
  //   );
  //   const data = await response.json();
  //   return data.recordings.map((recording: any) => recording.file);
  // };

  // fetchBirdSounds(bird.sciName).then((data: any) => {
  //   console.log(data);
  // });

  const {
    data: imagesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["images", bird.sciName],
    queryFn: () => fetchBirdImages(bird.sciName),
  });

  return (
    <div
      key={bird.speciesCode}
      className="bg-green-50 border border-green-400 rounded-lg p-4 w-full max-w-sm mx-auto shadow-md"
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        {bird.comName}
      </h3>
      {isLoading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {imagesData && (
        <picture>
          <img
            className="w-full h-48 object-contain rounded-lg mb-3"
            src={imagesData[0]}
            alt={bird.comName}
          />
        </picture>
      )}
      <p className="text-gray-700">
        <b className="text-gray-900">Count:</b> {bird.howMany}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Location:</b> {bird.locName}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Date:</b> {formattedDate}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Time:</b> {formattedTime}
      </p>
      {imagesData && (
         <p className="text-sm text-center">
        {" "}
        image from Flickr{" "}
        <a
          className="text-green-800 hover:text-green-500 text-sm underline"
          href={imagesData[1]}
          target="_blank"
          rel="noreferrer"
        >
          author
        </a>
      </p>
        )}
     
    </div>
  );
}

export default BirdCard;
