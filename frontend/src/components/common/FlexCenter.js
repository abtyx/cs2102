import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  ${props => (props.horizontal ? `justify-content: center;` : '')}
  ${props => (props.vertical ? `align-items: center;` : '')}
  ${props =>
    !props.horizontal && !props.vertical
      ? `
    align-items: center;
    justify-content: center;
  `
      : ''}
  ${props => (props.fullheight ? `height: 100%;` : '')}
`;

export const FlexCenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
