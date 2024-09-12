import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'realm/dist/bundle';

// Assuming you have a token in response.data.token
export const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('JwtToken', token);
        console.log('Token stored successfully!');
    } catch (error) {
        console.error('Error storing token:', error);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('JwtToken');
        if (token !== null) {
            return token;
        } else {
            console.log('Token not found');
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};


export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('JwtToken')
    } catch(error) {
        console.error('Error removing token:', error);
    }

    console.log('Done.')
}

export const storeUser = async (user: string) => {
    try {
        const userToStore = JSON.stringify(user);
        await AsyncStorage.setItem('AppUser', userToStore);
        console.log('User stored successfully!');
    } catch (error) {
        console.error('Error storing user:', error);
    }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('AppUser');
        if (user !== null) {
            return user
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
    }
};

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem('AppUser')
    } catch(error) {
        console.error('Error removing user:', error);
    }

    console.log('Done.')
}

