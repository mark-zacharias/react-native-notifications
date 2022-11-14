import { Component, ReactNode } from 'react';
import { Text } from 'react-native';
import { Notifications } from 'react-native-notifications';
import DeviceInfo from 'react-native-device-info';

class RegisterNotifications extends Component {
	constructor(props) {
		super(props);
		// Request permissions on iOS, refresh token on Android
		Notifications.registerRemoteNotifications();

		Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
			// TODO: Send the token to my server so it could send back push notifications...
			console.log('Device Token Received', event.deviceToken);
		});
		Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
			console.error(event);
		});
	}

	render(): ReactNode {
		const deviceId = DeviceInfo.getUniqueIdSync();
		console.log('device Id', deviceId);
		return (
			<Text>Register Component</Text>
		);
	}
}

export default RegisterNotifications;
