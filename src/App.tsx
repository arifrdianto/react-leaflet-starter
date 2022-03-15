import { LatLngExpression } from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { decode } from "@googlemaps/polyline-codec";
import { Icon } from "leaflet";
import DestinationSVG from "./assets/images/destination.svg";
import EntranceSVG from "./assets/images/entrance.svg";
import ExitSVG from "./assets/images/exit.svg";
import { routes } from "./data";

const IconDestination = new Icon({
  iconUrl: DestinationSVG,
  iconSize: [32, 32],
});

const IconEntrance = new Icon({
  iconUrl: EntranceSVG,
  iconSize: [16, 16],
});

const IconExit = new Icon({
  iconUrl: ExitSVG,
  iconSize: [16, 16],
});

const center: LatLngExpression = [-6.302495002746582, 106.81662750244141];
interface Coordinate {
  lat: number;
  lng: number;
}
interface MarkerProps {
  name: string;
  color: string;
  icon: string;
  type: string;
  coordinate: Coordinate;
}

const MarkerIcon = (marker: MarkerProps): JSX.Element => {
  switch (marker.type) {
    case "start":
    case "end":
      return (
        <Marker
          icon={IconDestination}
          position={[marker.coordinate.lat, marker.coordinate.lng]}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      );

    case "entrance":
      return (
        <Marker
          icon={IconEntrance}
          position={[marker.coordinate.lat, marker.coordinate.lng]}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      );

    case "exit":
      return (
        <Marker
          icon={IconExit}
          position={[marker.coordinate.lat, marker.coordinate.lng]}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      );

    case "stop":
      return (
        <CircleMarker
          center={[marker.coordinate.lat, marker.coordinate.lng]}
          pathOptions={{
            color: `#${marker.color}`,
            weight: 2,
            fillColor: "#FFFFFF",
            fillOpacity: 0.8,
          }}
          radius={4}
        >
          <Popup>{marker.name}</Popup>
        </CircleMarker>
      );

    default:
      return (
        <Circle
          center={[marker.coordinate.lat, marker.coordinate.lng]}
          pathOptions={{
            color: `#${marker.color}`,
            fillColor: `#${marker.color}`,
          }}
          radius={2}
        />
      );
  }
};

export default function VectorLayersExample() {
  return (
    <MapContainer center={center} zoom={13}>
      <TileLayer
        url="https://api.mapbox.com/styles/v1/rudianto-nutech/ckzs2rz1c002x14pam3yxwcrt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicnVkaWFudG8tbnV0ZWNoIiwiYSI6ImNrenMyd2IwdjBudXQycG85bHliYWozMTcifQ.jnYvd8Rr6mgenCxU3Axnyg"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      {routes.details.map.shapes.map((item, i) => (
        <Polyline
          key={item.shape}
          pathOptions={{
            weight: 3,
            color: `#${item.color}`,
          }}
          dashArray={item.type === "walking" ? "5, 10" : ""}
          positions={decode(item.shape)}
        />
      ))}
      {routes.details.map.markers.map((item, i) => (
        <MarkerIcon {...item} key={`${item.name}-${i}`} />
      ))}
    </MapContainer>
  );
}
