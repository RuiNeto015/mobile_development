import * as React from "react";
import { NativeBaseProvider } from "native-base";
import RootNavigation from "./app/navigation/RootNavigation";
import messaging from "@react-native-firebase/messaging";
import { Alert, AppRegistry } from 'react-native';
import {PermissionsAndroid} from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

function App() {
  async function requestUserPermission() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }
  
  React.useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
    
      PushNotification.createChannel(
        {
          channelId: 'channel-id', // (required)
          channelName: 'My channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: 'notification.mp3', // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        channelId: "channel-id" 
      });
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("Token=", token);
  };

  React.useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
    <NativeBaseProvider>
      <RootNavigation />
    </NativeBaseProvider>
  );
}

AppRegistry.registerComponent('app', () => HeadlessCheck);

export default App;
