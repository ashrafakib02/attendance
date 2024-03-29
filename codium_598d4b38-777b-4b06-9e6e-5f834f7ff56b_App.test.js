

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// Generated by CodiumAI

describe('App', () => {

    // Renders a View component with a style prop containing a container object.
    it('should render a View component with a style prop containing a container object', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(View).prop('style')).toEqual(styles.container);
    });
});
