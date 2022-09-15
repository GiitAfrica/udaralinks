import {ToastAndroid} from 'react-native';

const toast = msg => {
  ToastAndroid.showWithGravity(
    String(msg),
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
  );
};

export default toast;
