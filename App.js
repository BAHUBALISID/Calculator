import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  Vibration,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Calculator = () => {
  const [currentInput, setCurrentInput] = useState('0');
  const [calculation, setCalculation] = useState('');
  const [currentOperation, setCurrentOperation] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  const buttonScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9]
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

  const vibrate = () => {
    Vibration.vibrate(50);
  };

  const handleButtonPress = (callback) => {
    animateButton();
    vibrate();
    callback();
  };

  const appendNumber = (number) => {
    if (currentInput === '0' || currentInput === 'Tora mai ke choco') {
      setCurrentInput(number);
    } else {
      setCurrentInput(currentInput + number);
    }
  };

  const appendOperation = (operation) => {
    if (currentInput === 'Tora mai ke choco') {
      clearAll();
      return;
    }
    
    if (previousValue === null) {
      setPreviousValue(parseFloat(currentInput));
    } else if (currentOperation) {
      calculateResult();
    }
    
    setCurrentOperation(operation);
    setCalculation(`${previousValue || parseFloat(currentInput)} ${operation}`);
    setCurrentInput('0');
  };

  const appendDecimal = () => {
    if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.');
    }
  };

  const appendPercentage = () => {
    if (currentInput !== 'Tora mai ke choco') {
      setCurrentInput((parseFloat(currentInput) / 100).toString());
    }
  };

  const calculateResult = () => {
    if (!currentOperation || previousValue === null) return;
    
    const currentValue = parseFloat(currentInput);
    
    // Handle division by zero
    if (currentOperation === '÷' && currentValue === 0) {
      setCurrentInput('Tora mai ke choco');
      setCalculation('');
      setPreviousValue(null);
      setCurrentOperation(null);
      return;
    }
    
    let result;
    switch (currentOperation) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '×':
        result = previousValue * currentValue;
        break;
      case '÷':
        result = previousValue / currentValue;
        break;
      default:
        return;
    }
    
    // Add to history
    const historyEntry = `${previousValue} ${currentOperation} ${currentValue} = ${result}`;
    setCalculationHistory([historyEntry, ...calculationHistory.slice(0, 4)]);
    
    setCurrentInput(result.toString());
    setCalculation(`${previousValue} ${currentOperation} ${currentValue} =`);
    setPreviousValue(result);
    setCurrentOperation(null);
  };

  const clearAll = () => {
    setCurrentInput('0');
    setCalculation('');
    setPreviousValue(null);
    setCurrentOperation(null);
  };

  const backspace = () => {
    if (currentInput !== 'Tora mai ke choco') {
      if (currentInput.length > 1) {
        setCurrentInput(currentInput.slice(0, -1));
      } else {
        setCurrentInput('0');
      }
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const Button = ({ title, onPress, style, textStyle, isOperation = false, isOperator = false, isSpecial = false, isZero = false }) => {
    const backgroundColor = darkMode ? 
      (isOperator ? '#ff9500' : isSpecial ? '#a777e3' : '#2a2a2a') : 
      (isOperator ? '#ff9500' : isSpecial ? '#a777e3' : '#f9f9f9');
    
    const color = isOperator || isSpecial ? 'white' : (darkMode ? 'white' : 'black');

    return (
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor },
            isZero && styles.zeroButton,
            style
          ]}
          onPress={() => handleButtonPress(onPress)}
        >
          <Text style={[styles.buttonText, { color }, textStyle]}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const containerStyle = {
    backgroundColor: darkMode ? '#1a1a1a' : '#fff'
  };

  const displayStyle = {
    color: darkMode ? '#fff' : '#000'
  };

  const calculationStyle = {
    color: darkMode ? '#aaa' : '#888'
  };

  const historyStyle = {
    color: darkMode ? '#aaa' : '#888'
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerText, displayStyle]}>Calculator</Text>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons
            name={darkMode ? 'moon' : 'sunny'}
            size={24}
            color={darkMode ? '#6e8efb' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.displayContainer}>
        <Text style={[styles.calculationText, calculationStyle]}>{calculation}</Text>
        <Text style={[styles.displayText, displayStyle]}>{currentInput}</Text>
      </View>

      <View style={[styles.buttonsContainer, darkMode && styles.darkButtonsContainer]}>
        <View style={styles.row}>
          <Button title="C" onPress={clearAll} isSpecial />
          <Button title="⌫" onPress={backspace} isOperation />
          <Button title="%" onPress={appendPercentage} isOperation />
          <Button title="÷" onPress={() => appendOperation('÷')} isOperator />
        </View>
        
        <View style={styles.row}>
          <Button title="7" onPress={() => appendNumber('7')} />
          <Button title="8" onPress={() => appendNumber('8')} />
          <Button title="9" onPress={() => appendNumber('9')} />
          <Button title="×" onPress={() => appendOperation('×')} isOperator />
        </View>
        
        <View style={styles.row}>
          <Button title="4" onPress={() => appendNumber('4')} />
          <Button title="5" onPress={() => appendNumber('5')} />
          <Button title="6" onPress={() => appendNumber('6')} />
          <Button title="-" onPress={() => appendOperation('-')} isOperator />
        </View>
        
        <View style={styles.row}>
          <Button title="1" onPress={() => appendNumber('1')} />
          <Button title="2" onPress={() => appendNumber('2')} />
          <Button title="3" onPress={() => appendNumber('3')} />
          <Button title="+" onPress={() => appendOperation('+')} isOperator />
        </View>
        
        <View style={styles.row}>
          <Button title="0" onPress={() => appendNumber('0')} isZero />
          <Button title="." onPress={appendDecimal} />
          <Button title="=" onPress={calculateResult} isOperator />
        </View>
      </View>

      {calculationHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={[styles.historyTitle, historyStyle]}>History</Text>
          <ScrollView>
            {calculationHistory.map((item, index) => (
              <Text key={index} style={[styles.historyItem, historyStyle]}>{item}</Text>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const buttonSize = width / 4 - 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  themeToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end'
  },
  calculationText: {
    fontSize: 20,
    marginBottom: 10,
    minHeight: 24
  },
  displayText: {
    fontSize: 48,
    fontWeight: '300'
  },
  buttonsContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  darkButtonsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
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
  zeroButton: {
    width: buttonSize * 2 + 10,
    borderRadius: buttonSize / 2
  },
  buttonText: {
    fontSize: 24
  },
  historyContainer: {
    marginTop: 20,
    padding: 15,
    maxHeight: 150
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  historyItem: {
    fontSize: 14,
    marginBottom: 5
  }
});

export default Calculator;
