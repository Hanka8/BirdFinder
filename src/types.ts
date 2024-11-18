export interface LocationFormProps {
  latitude: string;
  longitude: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
  refetchBirdData: () => void;
  geolocationManually: boolean; // Re-add this prop
  setGeolocationManually: (value: boolean) => void; // Re-add this prop
}

export interface FetchBirdsNearby {
  (params: { latitude: string; longitude: string }): Promise<Bird[]>;
}

export interface Bird {
  speciesCode: string;
  comName: string;
  sciName: string;
  locName: string;
  obsDt: string;
  howMany: number;
  lat: number;
  lng: number;
}

export interface BirdCardProps {
  bird: Bird;
}

export interface FetchBirdData {
  (birdName: string): Promise<string>;
}

export interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export interface InteractiveMapProps {
  latitude: string;
  longitude: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
  data: Bird[] | undefined;
}
