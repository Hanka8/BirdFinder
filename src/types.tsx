export type FetchBirdsNearby = (arg0: {
  latitude: string;
  longitude: string;
}) => Promise<Bird[]>;

export type LocationFormProps = {
  latitude: string;
  longitude: string;
  geolocationManually: boolean;
  refetchBirdData: () => void;
  setLoadingLocation: (value: boolean) => void;
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
  lat: number;
  lng: number;
};

export type BirdCardProps = {
  bird: Bird;
};

export interface BirdData {
  type: string;
  title: string;
  displaytitle: string;
  namespace: {
    id: number;
    text: string;
  };
  wikibase_item: string;
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  pageid: number;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  content_urls: {
    desktop: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
    mobile: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
  };
  description: string;
  description_source: string;
  dir: string;
  extract: string;
  extract_html: string;
  revision: string;
  tid: string;
  timestamp: string;
}

export type FetchBirdData = (birdName: string) => Promise<BirdData>;

export type LoadingProps = {
  loadingText: string;
  animationType?: "balls" | "bars" | "bubbles" | "spin" | "cylon"  | "spin" | "spinningBubbles" | "spokes";
};

export type ErrorProps = {
  message: string;
};

export type InteractiveMapProps = {
  latitude: string;
  longitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  data: Bird[] | undefined;
};

export type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}