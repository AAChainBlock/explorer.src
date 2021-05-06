import React from 'react';

import { connect } from 'react-redux';
import { STATUS_NORMAL } from './ConnectionIndicatorReducer'

import styled from 'styled-components';



const ConnectionIndicator = (props) => {

  let { headblock:
        { data: headblockData },
        lastblockinfo:
        { data: lastblockinfoData },
        connectionIndicator
      } = props;

  let { payload : [{block_num: headblockNum }={}]= [] } = headblockData;
  let { payload : {head_block_num: lastblockinfoNum }= {} } = lastblockinfoData;

  return (
    <StyledWrapper>
      <StyledDiv>
        <Indicator status={connectionIndicator.status.lastblockinfoStatus}>&nbsp;</Indicator>
        <StyledInner>
          <StyledName>节点</StyledName>
          <StyledBlockNum>{lastblockinfoNum ? lastblockinfoNum : ` - `}</StyledBlockNum>
        </StyledInner>
      </StyledDiv>
      <StyledDiv>
        <Indicator status={connectionIndicator.status.headblockStatus}>&nbsp;</Indicator>
        <StyledInner>
          <StyledName>MongoDB</StyledName>
          <StyledBlockNum>{headblockNum ? headblockNum : ` - `}</StyledBlockNum>
        </StyledInner>
      </StyledDiv>
    </StyledWrapper>
  );
}

export default connect(
  ({ headblock, lastblockinfo, connectionIndicator }) => ({
    headblock, lastblockinfo, connectionIndicator
  }),
  {
  }

)(ConnectionIndicator);
