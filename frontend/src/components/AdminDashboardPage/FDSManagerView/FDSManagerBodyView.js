import React from 'react';
import Field from '../../common/Field';
import LabelledField from '../../common/LabelledField';

const FDSManagerBodyView = ({ staff, editProps: { password, setPassword, isEditMode } }) =>
  isEditMode ? (
    <>
      <LabelledField label="Password" value={password} onChange={setPassword} type="password" />
    </>
  ) : null;

export default FDSManagerBodyView;
