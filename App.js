import React, { useState, useRef } from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DIV_ZERO_MSG = "Tora mai ke choco";

export default function App() {
  const [currentInput, setCurrentInput] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const animValue = useRef(new Animated.Value(0)).current;

  const buttonScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const appendNumber = (num) => {
    animateButton();
    if (currentInput === "0" || currentInput === DIV_ZERO_MSG) {
      setCurrentInput(num.toString());
    } else {
      setCurrentInput(currentInput + num);
    }
  };

  const appendDecimal = () => {
    animateButton();
    if (!currentInput.includes(".") && currentInput !== DIV_ZERO_MSG) {
      setCurrentInput(currentInput + ".");
    }
  };

  const appendOperation = (op) => {
    animateButton();
    if (currentInput === DIV_ZERO_MSG) return clearAll();

    setPreviousValue(parseFloat(currentInput));
    setOperation(op);
    setCurrentInput("0");
  };

  const calculateResult = () => {
    animateButton();
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(currentInput);

      // Divide by zero handling
      if (operation === "÷" && currentValue === 0) {
        setCurrentInput(DIV_ZERO_MSG);
        setPreviousValue(null);
        setOperation(null);
        return;
      }

      let result;
      switch (operation) {
        case "+":
          result = previousValue + currentValue;
          break;
        case "-":
          result = previousValue - currentValue;
          break;
        case "×":
          result = previousValue * currentValue;
          break;
        case "÷":
          result = previousValue / currentValue;
          break;
        default:
          return;
      }

      const entry = `${previousValue} ${operation} ${currentValue} = ${result}`;
      setHistory([entry, ...history]);

      setCurrentInput(result.toString());
      setPreviousValue(null);
      setOperation(null);
    }
  };

  const clearAll = () => {
    animateButton();
    setCurrentInput("0");
    setPreviousValue(null);
    setOperation(null);
  };

  const toggleSign = () => {
    animateButton();
    if (currentInput !== "0" && currentInput !== DIV_ZERO_MSG) {
      setCurrentInput((parseFloat(currentInput) * -1).toString());
    }
  };

  const percentage = () => {
    animateButton();
    if (currentInput !== DIV_ZERO_MSG) {
      setCurrentInput((parseFloat(currentInput) / 100).toString());
    }
  };

  const backspace = () => {
    animateButton();
    if (currentInput === DIV_ZERO_MSG) {
      setCurrentInput("0");
      return;
    }
    if (currentInput.length > 1) {
      setCurrentInput(currentInput.slice(0, -1));
    } else {
      setCurrentInput("0");
    }
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const containerStyle = {
    backgroundColor: darkMode ? "#222" : "#fff",
  };

  const displayStyle = {
    color: darkMode ? "#fff" : "#000",
  };

  const buttonStyle = {
    backgroundColor: darkMode ? "#444" : "#eee",
  };

  const buttonTextStyle = {
    color: darkMode ? "#fff" : "#000",
  };

  const Button = ({ title, onPress, style, textStyle, isOperation = false }) => (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyle,
          isOperation && styles.operationButton,
          style,
        ]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* Theme Toggle */}
      <View style={styles.themeToggle}>
        <Ionicons
          name={darkMode ? "moon" : "sunny"}
          size={28}
          color={darkMode ? "white" : "black"}
          onPress={handleToggleTheme}
        />
      </View>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={[styles.displayText, displayStyle]} numberOfLines={1}>
          {currentInput}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button title="C" onPress={clearAll} isOperation />
          <Button title="⌫" onPress={backspace} isOperation />
          <Button title="%" onPress={percentage} isOperation />
          <Button title="÷" onPress={() => appendOperation("÷")} isOperation />
        </View>

        <View style={styles.row}>
          <Button title="7" onPress={() => appendNumber(7)} />
          <Button title="8" onPress={() => appendNumber(8)} />
          <Button title="9" onPress={() => appendNumber(9)} />
          <Button title="×" onPress={() => appendOperation("×")} isOperation />
        </View>

        <View style={styles.row}>
          <Button title="4" onPress={() => appendNumber(4)} />
          <Button title="5" onPress={() => appendNumber(5)} />
          <Button title="6" onPress={() => appendNumber(6)} />
          <Button title="-" onPress={() => appendOperation("-")} isOperation />
        </View>

        <View style={styles.row}>
          <Button title="1" onPress={() => appendNumber(1)} />
          <Button title="2" onPress={() => appendNumber(2)} />
          <Button title="3" onPress={() => appendNumber(3)} />
          <Button title="+" onPress={() => appendOperation("+")} isOperation />
        </View>

        <View style={styles.row}>
          <Button title="±" onPress={toggleSign} isOperation />
          <Button title="0" onPress={() => appendNumber(0)} style={styles.zeroButton} />
          <Button title="." onPress={appendDecimal} />
          <Button title="=" onPress={calculateResult} isOperation style={styles.equalsButton} />
        </View>
      </View>

      {/* History */}
      {history.length > 0 && (
        <ScrollView style={styles.historyContainer}>
          <Text style={[styles.historyTitle, displayStyle]}>History</Text>
          {history.slice(0, 5).map((item, index) => (
            <Text key={index} style={[styles.historyItem, displayStyle]}>
              {item}
            </Text>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const buttonSize = width / 4 - 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  displayContainer: {
    padding: 20,
    alignItems: "flex-end",
    marginBottom: 20,
  },
  displayText: {
    fontSize: 48,
    fontWeight: "300",
  },
  buttonsContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  operationButton: {
    backgroundColor: "#ff9500",
  },
  zeroButton: {
    width: buttonSize * 2 + 10,
    borderRadius: buttonSize / 2,
  },
  equalsButton: {
    backgroundColor: "#ff9500",
  },
  buttonText: {
    fontSize: 24,
  },
  historyContainer: {
    marginTop: 20,
    padding: 10,
    maxHeight: 150,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});
