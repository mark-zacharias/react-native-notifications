import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import DemoNotificationRegistrationService from './DemoNotificationRegistrationService';
import DemoNotificationService from './DemoNotificationService';
import Config from './NotficationConfig';

const NotificationPage = () => {
    const [isBusy, setIsBusy] = useState(false);
    const [registeredToken, setRegisteredToken] = useState('');
    const [registeredOS, setRegisteredOS] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] = useState('');

    const deviceId = DeviceInfo.getUniqueId();

    const onTokenReceived = (token: any) => {
        console.log(`Received a notification token on ${token.os}`);
        setRegisteredToken(token.token);
        setRegisteredOS(token.os);
        setStatus(`The push notifications token has been received.`);

        if (isRegistered && registeredToken && registeredOS) {
          onRegisterButtonPress();
        }
    };

    const onNotificationReceived = (notification: any) => {
        console.log(`Received a push notification on ${registeredOS}`);
        setStatus(`Received a push notification...`);

        if (notification.data.message) {
          Alert.alert(Config.appName, `${notification.data.action} action received`);
        }
    };
    const notificationService = new DemoNotificationService(onTokenReceived, onNotificationReceived);
    const notificationRegistrationService = new DemoNotificationRegistrationService(Config.apiUrl, Config.apiKey);

    const onRegisterButtonPress = async () => {
        if (!registeredToken || !registeredOS) {
            Alert.alert("The push notifications token wasn't received.");
            return;
          }

          try {
              setIsBusy(true);
              setStatus('Registering...');
              const pnPlatform = registeredOS == "ios" ? "apns" : "fcm";
                const pnToken = registeredToken;
            const request = {
              installationId: deviceId,
              platform: pnPlatform,
              pushChannel: pnToken,
              tags: []
            };
            const response = await notificationRegistrationService.registerAsync(request);
            setStatus(`Registered for ${registeredOS} push notifications`);
            setIsRegistered(true);
          } catch (e) {
            setStatus(`Registration failed: ${e}`);
          }
          finally {
            setIsBusy(false);
          }
        };

    const onDeregisterButtonPress = async () => {
        if (!notificationService) {return;}

      try {
        setIsBusy(true);
        setStatus('Deregistering...');

        await notificationRegistrationService.deregisterAsync(deviceId);
        setStatus('Deregistered from push notifications');
        setIsRegistered(false);
      } catch (e) {
        setStatus(`Deregistration failed: ${e}`);
      }
      finally {
          setIsBusy(false);
      }
    };


    return (
        <View style={styles.container}>
        {isBusy &&
          <ActivityIndicator></ActivityIndicator>
        }
        <View style={styles.button}>
          <Button title="Register" onPress={onRegisterButtonPress} disabled={isBusy} />
        </View>
        <View style={styles.button}>
          <Button title="Deregister" onPress={onDeregisterButtonPress} disabled={isBusy} />
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: 50,
    },
    button: {
        margin: 5,
        width: '100%',
    },
});

export default NotificationPage;
