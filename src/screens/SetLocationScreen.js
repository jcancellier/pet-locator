import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Image,
	Keyboard,
	ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { setZipcodeFilter, fetchPets, fetchLocation, clearLocationInfo, setInitialLaunch } from '../actions';
import { Ionicons } from '@expo/vector-icons';
import { BallIndicator } from 'react-native-indicators';
import { Header } from 'react-navigation';
import { Colors, Fonts } from '../global';
import { Footer, Button, Text } from '../components/common';
import NavigationStyles from '../navigation/styles';

class SetLocationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zipcode: '',
			city: '',
			country: ''
		}
	}

	static navigationOptions = {
		title: 'Set Location',
		headerStyle: {
			//TODO: Add android shadows
			shadowOpacity: 0.4,
			shadowOffset: { width: 0, height: 1 },
			shadowRadius: 5,
			borderBottomWidth: 0,
			backgroundColor: Colors.primary
		},
		headerTitleStyle: NavigationStyles.headerTitleStyle,
		gesturesEnabled: false
	}

	static getDerivedStateFromProps(props, state) {
		console.log('deriving props');
		let zipcode = props.fetchedZipcode === '' ? props.zipcode : props.fetchedZipcode;

		// prevent showing previous zipcode while fetching (if textInput is empty)
		// if(props.isLoading) 
		// 	zipcode = ''

		return {
			zipcode: zipcode
		}
	}

	componentDidMount() {
		this.props.navigation.setParams({
			clearFetchedLocationInfo: this.props.clearLocationInfo
		})
		this.props.clearLocationInfo();
	}

	_onSaveLocationPress = () => {
		this.props.setZipcodeFilter(this.state.zipcode);
		this.props.fetchPets(true, true);
		this.props.clearLocationInfo();
		if(this.props.initialLaunch)
			this.props.navigation.navigate('Main');
		else
			this.props.navigation.goBack();
		this.props.setInitialLaunch(false);
	}

	_renderSpinnerOrText = () => {
		if (!this.props.isLoading) {
			return (
				<Text style={styles.cityAndCountryText} numberOfLines={1}>{(this.props.city && this.props.country) ? `${this.props.city}, ${this.props.country}` : ''}</Text>
			);
		}
		else {
			return (
				<BallIndicator color={Colors.primary} size={16} style={styles.loadingLocationSpinner} />
			);
		}
	}

	_validateZipcode = () => {
		if(typeof this.state.zipcode !== 'undefined'){
			if(this.state.zipcode.length == 5)
				return true;
		}
		return false;
	}

	render() {
		return (
			<TouchableOpacity style={styles.container} activeOpacity={1.0} onPress={Keyboard.dismiss}>
				<ImageBackground style={styles.container} source={require('../../assets/map.png')}>
					<KeyboardAvoidingView
						behavior="padding"
						enabled
						keyboardVerticalOffset={Header.HEIGHT}
						style={styles.container}
					>
						<View style={styles.header} >
							<Image source={require('../../assets/icons/location.png')} style={styles.locationIcon} />
						</View>
						<View style={styles.body}>
							<View>
								<TouchableOpacity
									style={styles.getLocationButton}
									onPress={this.props.fetchLocation}
								>
									<Ionicons name='md-pin' size={20} color={Colors.flat.clouds} style={styles.getLocationButtonIcon} />
									<Text style={styles.getLocationButtonText}>Get Location</Text>
								</TouchableOpacity>
								<TextInput
									style={styles.zipcodeInput}
									placeholder='Zip Code'
									onChangeText={(zipcode) => this.setState({ zipcode })}
									value={this.state.zipcode}
									keyboardType='number-pad'
									maxLength={5}
									underlineColorAndroid='transparent'
								/>
							</View>
							{this._renderSpinnerOrText()}
						</View>
						<Footer style={{ backgroundColor: 'white' }}>
							<Button
								textStyle={styles.saveLocationButtonText}
								style={styles.saveLocationButtonEnabled}
								disabledStyle={styles.saveLocationButtonDisabled}
								onPress={this._onSaveLocationPress}
								disabled={!this._validateZipcode()}
							>
								Save Location
						</Button>
						</Footer>
					</KeyboardAvoidingView>
				</ImageBackground>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	getLocationButton: {
		backgroundColor: Colors.primary,
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	getLocationButtonText: {
		padding: 8,
		fontSize: 20,
		fontFamily: Fonts.primary,
		color: Colors.flat.clouds,
		alignSelf: 'center',
	},
	getLocationButtonIcon: {
		padding: 5,
		paddingLeft: 8
	},
	zipcodeInput: {
		backgroundColor: 'white',
		fontSize: 20,
		fontFamily: Fonts.primary,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(0,0,0,0.2)',
		paddingVertical: 10,
		paddingHorizontal: 30,
		borderRadius: 10,
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'center'
	},
	locationIcon: {
		width: 100,
		height: 100,
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	body: {
		flex: 1,
		alignItems: 'center',
	},
	saveLocationButtonEnabled: {
		backgroundColor: Colors.material.green600,
		borderRadius: 5
	},
	saveLocationButtonDisabled: {
		backgroundColor: 'rgba(0,0,0,0.4)',
		borderRadius: 5
	},
	saveLocationButtonText: {
		fontFamily: Fonts.primary,
		color: Colors.flat.clouds,
		fontSize: 18
	},
	cityAndCountryText: {
		textAlign: 'center',
		fontFamily: Fonts.primary,
		fontSize: 16
	},
	loadingLocationSpinner: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		flex: 0
	}
})

const mapStateToProps = (state) => {
	return {
		zipcode: state.filters.location,
		fetchedZipcode: state.location.zipcode,
		city: state.location.city,
		country: state.location.country,
		isLoading: state.location.isLoading,
		initialLaunch: state.user.initialLaunch
	}
}

export default connect(mapStateToProps, {
	setZipcodeFilter,
	fetchPets,
	fetchLocation,
	clearLocationInfo,
	setInitialLaunch
})(SetLocationScreen);