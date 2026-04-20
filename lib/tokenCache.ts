// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return await AsyncStorage.getItem(key);
//     } catch {
//       return null;
//     }
//   },

//   async saveToken(key: string, value: string) {
//     try {
//       await AsyncStorage.setItem(key, value);
//     } catch {
//       // fail silently
//     }
//   },

//   async clearToken(key: string) {
//     try {
//       await AsyncStorage.removeItem(key);
//     } catch {
//       // fail silently
//     }
//   },
// };

export const tokenCache = {
  async getToken(_key: string) {
    return null;
  },
  async saveToken(_key: string, _value: string) {},
  async clearToken(_key: string) {},
};