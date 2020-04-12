import React from 'react';
import useStore from './stores';
import { observer } from 'mobx-react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import FlexCenter, { FlexCenterColumn } from './components/common/FlexCenter';

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 32px;
  z-index: 10000;
`;

const NotificationCenter = observer(() => {
  const notifications = useStore('notifications');

  return (
    <Wrapper>
      <FlexCenterColumn style={{ alignItems: 'center' }}>
        <AnimatePresence>
          {notifications.notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              style={{ width: '300px' }}
              positionTransition={{ duration: 0.5 }}
            >
              <div className={`notification is-${notif.type} m-b-sm`}>{notif.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </FlexCenterColumn>
    </Wrapper>
  );
});

export default NotificationCenter;
