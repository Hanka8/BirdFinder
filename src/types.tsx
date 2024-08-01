export type FetchBirdsNearby = (arg0: {
  latitude: string;
  longitude: string;
}) => Promise<any>;

export type LocationFormProps = {
  latitude: string;
  longitude: string;
  geolocationManually: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setGeolocationManually: (value: boolean) => void;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
};

export type Bird = {
  speciesCode: string;
  comName: string;
  sciName: string;
  howMany: number;
  locName: string;
  obsDt: string;
};

export type BirdCardProps = {
  bird: Bird;
};

export type FetchBirdImages = (birdName: string) => Promise<any>;

export type LoadingProps = {
  loadingText: string;
  animationType?: "balls" | "bars" | "bubbles" | "spin" | "cylon"  | "spin" | "spinningBubbles" | "spokes";
};

export type ErrorProps = {
  message: string;
};