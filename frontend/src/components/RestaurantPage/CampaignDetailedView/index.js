import { faMale, faFlag } from '@fortawesome/pro-regular-svg-icons';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackgroundImage from '../../../assets/backgrounds/trees.png';
import useStore from '../../../stores';
import EntityCard from '../../common/EntityCard';
import CampaignBodyView from './CampaignBodyView';
import { getRestaurantCampaign } from '../../../api';

const CampaignDetailedView = observer(() => {
  const { code } = useParams();
  const campaignStore = useStore('campaigns');
  const sessionStore = useStore('session');
  const campaign = campaignStore.campaignMap[code];

  useEffect(() => {
    getRestaurantCampaign(sessionStore.entityId, code).then(result => {
      campaignStore.updateCampaign(result);
    });
  }, [code]);

  return (
    <EntityCard
      bgSrc={BackgroundImage}
      avatarSrc={`https://api.adorable.io/avatars/128/${campaign.code}`}
      topIcon={faFlag}
      topText="Promotional Campaign"
      bottomText={campaign.name}
    >
      <CampaignBodyView campaign={campaign} />
    </EntityCard>
  );
});

export default CampaignDetailedView;
