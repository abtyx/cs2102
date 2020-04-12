import React from 'react';
import styled from 'styled-components';
import Image from './Image';
import FAIcon from './FAIcon';
import { faEdit, faCross, faTimes, faSave } from '@fortawesome/pro-regular-svg-icons';

const HeaderBG = styled.div`
  position: relative;
  display: flex;
  background: url(${props => props.bgSrc}) repeat;
  height: 128px;
`;

const Avatar = styled.div`
  position: absolute;
  box-sizing: border-box;
  bottom: -64px;
  left: 64px;
  height: 144px;
  width: 144px;
  border-radius: 144px;
  border: 8px solid white;
`;

const TextContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  margin-left: 220px;
`;

const ActionButtonsContainer = styled.div`
  position: absolute;
  top: 36px;
  right: 36px;
`;

const HeaderView = ({
  avatarSrc,
  bgSrc,
  topIcon,
  topText,
  bottomChild,
  editCallback,
  isEditMode,
  saveCallback,
  deleteCallback,
}) => (
  <HeaderBG className="m-b-xl" bgSrc={bgSrc}>
    <ActionButtonsContainer>
      <div className="buttons">
        {!isEditMode && editCallback ? (
          <button className="button is-info is-light" onClick={editCallback}>
            <span className="icon">
              <FAIcon icon={faEdit} />
            </span>
            <span>Edit</span>
          </button>
        ) : null}
        {isEditMode && saveCallback ? (
          <button className="button is-info is-light" onClick={saveCallback}>
            <span className="icon">
              <FAIcon icon={faSave} />
            </span>
            <span>Save</span>
          </button>
        ) : null}
        {deleteCallback ? (
          <button className="button is-danger is-light" onClick={deleteCallback}>
            <span className="icon">
              <FAIcon icon={faTimes} />
            </span>
            <span>Delete</span>
          </button>
        ) : null}
      </div>
    </ActionButtonsContainer>
    <Avatar>
      <Image size="xl" src={avatarSrc} rounded />
    </Avatar>
    <TextContainer className="m-b-sm">
      <h2 className="title has-text-grey">
        <FAIcon icon={topIcon} className="m-r-md" />
        <span>{topText}</span>
      </h2>
    </TextContainer>
    <TextContainer style={{ marginBottom: '-2.5em' }}>{bottomChild}</TextContainer>
  </HeaderBG>
);

export default HeaderView;
