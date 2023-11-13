import * as React from 'react';

import { StanzaProvider } from 'stanza-rn-sdk';
import { config } from './stanzaConfig';
import Main from './screens/Main';

export default function App() {
  return (
    <StanzaProvider config={config}>
      <Main />
    </StanzaProvider>
  );
}
