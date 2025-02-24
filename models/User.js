// const { db } = require('../configs/firebase');
// import { doc, setDoc, getDoc } from 'firebase/firestore';

// export const createUser = async (userData) => {
//     try {
//         const userRef = doc(db, 'users', userData.email);
//         await setDoc(userRef, {
//             email: userData.email,
//             name: userData.name,
//             photoURL: userData.photoURL,
//             accessToken: userData.accessToken,
//             isAdmin: false, // Default value
//             createdAt: new Date().toISOString()
//         });
//         return true;
//     } catch (error) {
//         console.error('Error creating user:', error);
//         return false;
//     }
// };

// export const getUser = async (email) => {
//     try {
//         const userRef = doc(db, 'users', email);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//             return userSnap.data();
//         }
//         return null;
//     } catch (error) {
//         console.error('Error getting user:', error);
//         return null;
//     }
// };