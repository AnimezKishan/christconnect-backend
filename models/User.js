const { db } = require('../configs/firebase');

const createUser = async (userData) => {
    try {
        await db.collection('users').doc(userData.email).set({
            email: userData.email,
            name: userData.name,
            photoURL: userData.photoURL,
            isAdmin: false, // Default value
            registrationNo: "2447___",
            createdAt: new Date().toISOString(),
            googleId: userData.googleId || null
        });
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
};

const getUser = async (email) => {
    try {
        const userDoc = await db.collection('users').doc(email).get();
        if (userDoc.exists) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

module.exports = {
    createUser,
    getUser
};