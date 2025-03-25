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
            googleId: userData.googleId || null,
            phone: null,
            department: null,
            course: null,
            year: null,
            semester: null,
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

const deleteUser = async (email) => {
    try {
        // Check if user exists before attempting to delete
        const userDoc = await db.collection('users').doc(email).get();
        if (!userDoc.exists) {
            return { success: false, message: 'User not found' };
        }
        
        // Delete the user document
        await db.collection('users').doc(email).delete();
        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Error deleting user', error: error.message };
    }
};

module.exports = {
    createUser,
    getUser,
    deleteUser
};