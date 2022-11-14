import React, { Component } from 'react';
import { PermissionsAndroid, Text } from 'react-native';
import { Notification, NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications';

class ReceiveNotifications extends Component {
	constructor(props) {
		super(props);
		Notifications.registerRemoteNotifications();

		PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');

		Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
			//console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
			console.log('Notification received in foreground:', notification);
			completion({ alert: true, sound: true, badge: true });
		});

		Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
			console.log(`Notification opened: ${notification.payload}`);
			completion();
		});

		Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationBackgroundFetchResult) => void) => {
			console.log('Notification Received - Background', notification.payload);

			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			completion({alert: true, sound: true, badge: false});
		});
	}

	render(): React.ReactNode {
		return (
			<Text>Receive Notifications</Text>
		);
	}
}

export default ReceiveNotifications;
