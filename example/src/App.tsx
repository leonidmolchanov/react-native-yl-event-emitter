import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RNYLEventEmitter } from 'react-native-yl-event-emitter';

export default function App() {
  const [result, setResult] = React.useState<boolean | undefined>();

  const emitter = new RNYLEventEmitter();

  const sendMessage = () => {
    emitter.sendEventToNative('test').then(setResult);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendMessage}>
        <Text>Result: {result ? 'y' : 'n'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
