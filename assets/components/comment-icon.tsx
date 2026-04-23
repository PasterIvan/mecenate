import { memo } from 'react';
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';

const CommentIconComponent = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#57626F"
        d="M19.5 11.531c0 3.367-3.357 6.094-7.5 6.094a8.97 8.97 0 0 1-3.05-.524 8.678 8.678 0 0 1-1.59.896c-.704.305-1.55.566-2.391.566a.47.47 0 0 1-.334-.8l.009-.01.038-.04a5.648 5.648 0 0 0 .589-.8c.292-.486.57-1.125.626-1.843-.878-.996-1.397-2.218-1.397-3.539 0-3.366 3.357-6.094 7.5-6.094s7.5 2.728 7.5 6.094Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M4.5 4.5h15v15h-15z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const CommentIcon = memo(CommentIconComponent);
