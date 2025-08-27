import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const animValue = useRef(new Animated.Value(0)).current;

  const buttonScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8]
  });

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleNumberInput = (num) => {
    animateButton();
    if (displayValue === '0') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperation = (op) => {
    animateButton();
    setOperation(op);
    setPreviousValue(displayValue);
    setDisplayValue('0');
  };

  const handleEquals = () => {
    animateButton();
    const current = parseFloat(displayValue);
    const previous = parseFloat(previousValue);
    
    if (operation && previous !== null) {
      let result;
      switch (operation) {
        case '+': result = previous + current; break;
        case '-': result = previous - current; break;
        case '×': result = previous * current; break;
        case '÷': result = previous / current; break;
        default: result = current;
      }
      
      const calculation = `${previous} ${operation} ${current} = ${result}`;
      setHistory([...history, calculation]);
      setDisplayValue(result.toString());
      setOperation(null);
      setPreviousValue(null);
    }
  };

  const handleClear = () => {
    animateButton();
    setDisplayValue('0');
    setOperation(null);
    setPreviousValue(null);
  };

  const handleToggle = () => {
    Animated.spring(animValue, {
      toValue: darkMode ? 0 : 1,
      useNativeDriver: true,
      speed: 20
    }).start();
    setDarkMode(!darkMode);
  };

  const containerStyle = {
    backgroundColor: darkMode ? '#222' : '#fff'
  };

  const displayStyle = {
    color: darkMode ? '#fff' : '#000'
  };

  const buttonStyle = {
    backgroundColor: darkMode ? '#444' : '#eee'
  };

  const buttonTextStyle = {
    color: darkMode ? '#fff' : '#000'
  };

  const Button = ({ title, onPress, style, textStyle, isOperation = false }) => (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        style={[styles.button, buttonStyle, isOperation && styles.operationButton, style]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.themeToggle}>
        <Ionicons
          name={darkMode ? 'moon' : 'sunny'}
          size={24}
          color={darkMode ? 'white' : 'black'}
          onPress={handleToggle}
        />
      </View>

      <View style={styles.displayContainer}>
        <Text style={[styles.displayText, displayStyle]}>{displayValue}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button title="C" onPress={handleClear} isOperation />
          <Button title="±" onPress={() => {}} isOperation />
          <Button title="%" onPress={() => {}} isOperation />
          <Button title="÷" onPress={() => handleOperation('÷')} isOperation />
        </View>
        
        <View style={styles.row}>
          <Button title="7" onPress={() => handleNumberInput(7)} />
          <Button title="8" onPress={() => handleNumberInput(8)} />
          <Button title="9" onPress={() => handleNumberInput(9)} />
          <Button title="×" onPress={() => handleOperation('×')} isOperation />
        </View>
        
        <View style={styles.row}>
          <Button title="4" onPress={() => handleNumberInput(4)} />
          <Button title="5" onPress={() => handleNumberInput(5)} />
          <Button title="6" onPress={() => handleNumberInput(6)} />
          <Button title="-" onPress={() => handleOperation('-')} isOperation />
        </View>
        
        <View style={styles.row}>
          <Button title="1" onPress={() => handleNumberInput(1)} />
          <Button title="2" onPress={() => handleNumberInput(2)} />
          <Button title="3" onPress={() => handleNumberInput(3)} />
          <Button title="+" onPress={() => handleOperation('+')} isOperation />
        </View>
        
        <View style={styles.row}>
          <Button title="0" onPress={() => handleNumberInput(0)} style={styles.zeroButton} />
          <Button title="." onPress={() => {}} />
          <Button title="=" onPress={handleEquals} isOperation style={styles.equalsButton} />
        </View>
      </View>

      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={[styles.historyTitle, displayStyle]}>History</Text>
          {history.slice(-3).map((item, index) => (
            <Text key={index} style={[styles.historyItem, displayStyle]}>{item}</Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const buttonSize = width / 4 - 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
    marginBottom: 20
  },
  displayText: {
    fontSize: 48,
    fontWeight: '300'
  },
  buttonsContainer: {
    paddingHorizontal: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  operationButton: {
    backgroundColor: '#ff9500'
  },
  zeroButton: {
    width: buttonSize * 2 + 10,
    borderRadius: buttonSize / 2
  },
  equalsButton: {
    backgroundColor: '#ff9500'
  },
  buttonText: {
    fontSize: 24
  },
  historyContainer: {
    marginTop: 20,
    padding: 10
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5
  }
});

export default Calculator;