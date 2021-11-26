import React from 'react';
import styled from 'styled-components';
import ethLogo from '../static/eth-logo.svg';
import compLogo from '../static/comp-logo.svg';
import Text from './Text';
import {colors} from '../theme';


const InputContainer = styled.div`
  border: 0px solid ${colors.lightBlue};
  border-radius: 8px;
  padding: 2px;
  input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${colors.lightBlue};
    padding: 5px;
  }
`;


const FieldInput = ({ balance, value, setValue, currency = 'default', title = 'From' }) => {
  return (
    <InputContainer>
      <div className="d-flex justify-content-between mb-2">
        <Text  color={colors.primary_light}>{title}</Text>
      </div>
      <div className="d-flex">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (setValue ) {
              setValue(e.target.value);
            }
          }}
        />

      </div>
    </InputContainer>
  );
};

export default FieldInput;
