import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { sendEventToNative } from 'react-native-yl-event-emitter';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();


  const sendMessage = ()=>{
    sendEventToNative(3, 7).then(setResult);

  }


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendMessage}>
      <Text>Result: {result}</Text>
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
