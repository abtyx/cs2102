import React from 'react';
import HeaderView from './HeaderView';

const EntityCard = ({
  children,
  topIcon,
  topText,
  bottomChild,
  imageSrc,
  bgSrc,
  avatarSrc,
  editCallback,
  isEditMode,
  saveCallback,
  deleteCallback,
}) => (
  <div className="card">
    <HeaderView
      topIcon={topIcon}
      topText={topText}
      bottomChild={bottomChild}
      imageSrc={imageSrc}
      bgSrc={bgSrc}
      avatarSrc={avatarSrc}
      editCallback={editCallback}
      isEditMode={isEditMode}
      saveCallback={saveCallback}
      deleteCallback={deleteCallback}
    />
    <div className="card-content p-l-xl p-r-xl">{children}</div>
  </div>
);

export default EntityCard;
