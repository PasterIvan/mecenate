import { memo } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const LikeIconComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="#57626F"
      d="m12.082 17.21-.082.083-.09-.082c-3.883-3.523-6.45-5.853-6.45-8.215 0-1.635 1.227-2.861 2.861-2.861 1.26 0 2.486.817 2.919 1.929h1.52c.433-1.112 1.66-1.93 2.918-1.93 1.635 0 2.861 1.227 2.861 2.862 0 2.362-2.566 4.692-6.457 8.215ZM15.678 4.5A4.916 4.916 0 0 0 12 6.2 4.916 4.916 0 0 0 8.32 4.5c-2.517 0-4.495 1.97-4.495 4.496 0 3.081 2.779 5.607 6.989 9.425L12 19.5l1.185-1.08c4.21-3.817 6.99-6.343 6.99-9.424 0-2.526-1.979-4.496-4.497-4.496Z"
    />
  </Svg>
);

export const LikeIcon = memo(LikeIconComponent);
