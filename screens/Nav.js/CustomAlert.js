// CustomAlert.js

import React from 'react';
import { Alert } from 'react-native';

const CustomAlert = ({ title, message }) => {
  Alert.alert(title, message);
};

export default CustomAlert;
