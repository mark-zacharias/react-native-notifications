import React from 'react';
import { Button, Text } from 'react-native';
import { Notifications } from 'react-native-notifications';

const TriggerNotification = () => {

    const onTriggerClick = () => {
        console.log('triggering a local notification');
        Notifications.postLocalNotification({
            title: 'Local Notification',
            body: 'This was generated within the app',
            badge: 1,
            identifier: '',
            payload: '',
            sound: '',
            thread: '',
            type: '',
        });
    };

    return (
        <>
            <Text>Trigger</Text>
            <Button title="Trigger" onPress={onTriggerClick} />
        </>
    );
};
export default TriggerNotification;
