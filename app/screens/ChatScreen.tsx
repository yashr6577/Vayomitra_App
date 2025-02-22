import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      {/* Replace 'https://www.example.com' with the URL you want to embed */}
      <WebView 
        source={{ uri: 'https://saya-ai-xptf.vercel.app/' }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
