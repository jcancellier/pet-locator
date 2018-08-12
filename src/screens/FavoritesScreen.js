import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PetFavoritesList from '../components/PetFavoritesList';
import { Fonts, Colors } from '../global';

class FavoritesScreen extends React.Component {

    componentDidMount() {
        console.log(this.props.favorites.length)
    }

    _renderNoFavorites = () => {
        return (
            <View style={noFavoritesStyles.container}>
                <View style={noFavoritesStyles.content}>
                    <Text style={noFavoritesStyles.header}>Nothing on your wishlist yet</Text>
                    <Text style={noFavoritesStyles.subHeader}>Tap the heart on any animal and we'll save the pets you love here</Text>
                    <TouchableOpacity
                        style={noFavoritesStyles.findPetButton}
                        onPress={() => this.props.navigation.navigate('Pets')}
                    >
                        <Text style={noFavoritesStyles.findPetButtonText}>
                            Find a pet to love
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderFavorites = () => {
        return (
            <View style={{ flex: 1}}>
                <PetFavoritesList navigation={this.props.navigation} pets={this.props.favorites}/>
            </View>
        )
    }

    render() {
        return (
            this.props.favorites.length == 0 ? this._renderNoFavorites() : this._renderFavorites()
        )
    }
}

const noFavoritesStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        alignItems: 'center',
        margin: 30
    },
    header: {
        fontFamily: Fonts.primary,
        fontSize: 24,
        paddingBottom: 5,
        textAlign: 'center',
    },
    subHeader: {
        fontFamily: Fonts.primary,
        color: Colors.flat.concrete,
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 30
    },
    findPetButton: {
        backgroundColor: Colors.primary,
        borderRadius: 5
    },
    findPetButtonText: {
        fontFamily: Fonts.primary,
        color: Colors.flat.clouds,
        padding: 10,
        fontSize: 18
    }
})

const mapStateToProps = (state) => {
    return {
        favorites: state.favorites.pets
    }
}

export default connect(mapStateToProps)(FavoritesScreen);