export type FetchBirdsNearby = (arg0: {
  latitude: string;
  longitude: string;
}) => Promise<Bird[]>;

export type LocationFormProps = {
  latitude: string;
  longitude: string;
  setAdressFromMap: (value: string) => void;
  refetchBirdData: () => void;
  setLoadingLocation: (value: boolean) => void;
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
  birdData?: BirdData;
  isLoading: boolean;
  error?: Error;
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

export type FetchBirdData = (birdName: string) => Promise<BirdData | null>;

export type LoadingProps = {
  animationType?:
    | "balls"
    | "bars"
    | "bubbles"
    | "spin"
    | "cylon"
    | "spin"
    | "spinningBubbles"
    | "spokes";
};

export type ErrorProps = {
  message: string;
};

export interface WikiResult {
  status: string;
  fetchStatus: string;
  isPending: boolean;
  isError: boolean;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  data?: BirdData;
}

export type InteractiveMapProps = {
  latitude: string;
  longitude: string;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  data?: Bird[];
  wikiDataMap: Map<string, BirdData>;
};

export type BirdPopupProps = {
  birds: Bird[];
  wikiDataMap: Map<string, BirdData>;
};

export type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
};

export type RegionalStructureItem = {
  name: string;
};
