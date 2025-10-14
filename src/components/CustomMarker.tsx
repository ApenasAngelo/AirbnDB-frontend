import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

interface CustomMarkerIconProps {
  price: number;
  isSelected?: boolean;
}

export const createCustomMarkerIcon = ({ price, isSelected }: CustomMarkerIconProps) => {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        backgroundColor: isSelected ? '#E11D48' : '#FFFFFF',
        color: isSelected ? '#FFFFFF' : '#222222',
        padding: '6px 10px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '14px',
        border: `2px solid ${isSelected ? '#E11D48' : '#222222'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      R$ {price}
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: 'custom-marker-icon',
    iconSize: [60, 32],
    iconAnchor: [30, 32],
  });
};
