import React from 'react';
import classnames from 'classnames';

const SquareImage = ({ size, rounded, className, style, ...props }) => (
  <figure
    className={classnames('image', className, {
      'is-16x16': size === 'xxs',
      'is-24x24': size === 'xs',
      'is-32x32': size === 's',
      'is-64x64': size === 'm',
      'is-96x96': size === 'l',
      'is-128x128': size === 'xl',
    })}
    style={style}
  >
    <img
      className={classnames({
        'is-rounded': rounded,
      })}
      {...props}
    />
  </figure>
);

Image.defaultProps = {
  size: 'm',
  rounded: false,
};

export default SquareImage;
