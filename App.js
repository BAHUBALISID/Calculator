import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Vibration,   // 👈 Import vibration
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

  const vibrate = () => {
    Vibration.vibrate(30); // small haptic feedback
  };

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

  const handlePress = (callback) => {
    vibrate();
    animateButton();
    callback();
  };

  const appendNumber = (num) =>
    handlePress(() => {
      if (currentInput === "0" || currentInput === DIV_ZERO_MSG) {
        setCurrentInput(num.toString());
      } else {
        setCurrentInput(currentInput + num);
      }
    });

  const appendDecimal = () =>
    handlePress(() => {
      if (!currentInput.includes(".") && currentInput !== DIV_ZERO_MSG) {
        setCurrentInput(currentInput + ".");
      }
    });

  const appendOperation = (op) =>
    handlePress(() => {
      if (currentInput === DIV_ZERO_MSG) return clearAll();

      setPreviousValue(parseFloat(currentInput));
      setOperation(op);
      setCurrentInput("0");
    });

  const calculateResult = () =>
    handlePress(() => {
      if (operation && previousValue !== null) {
        const currentValue = parseFloat(currentInput);

        if (operation === "÷" && currentValue === 0) {
          setCurrentInput(DIV_ZERO_MSG); // 👈 custom divide by zero message
          setPreviousValue(null);
          setOperation(null);
          return;
        }

        let result;
        switch (operation) {
          case "+": result = previousValue + currentValue; break;
          case "-": result = previousValue - currentValue; break;
          case "×": result = previousValue * currentValue; break;
          case "÷": result = previousValue / currentValue; break;
          default: return;
        }

        const entry = `${previousValue} ${operation} ${currentValue} = ${result}`;
        setHistory([entry, ...history]);

        setCurrentInput(result.toString());
        setPreviousValue(null);
        setOperation(null);
      }
    });

  const clearAll = () =>
    handlePress(() => {
      setCurrentInput("0");
      setPreviousValue(null);
      setOperation(null);
    });

  const toggleSign = () =>
    handlePress(() => {
      if (currentInput !== "0" && currentInput !== DIV_ZERO_MSG) {
        setCurrentInput((parseFloat(currentInput) * -1).toString());
      }
    });

  const percentage = () =>
    handlePress(() => {
      if (currentInput !== DIV_ZERO_MSG) {
        setCurrentInput((parseFloat(currentInput) / 100).toString());
      }
    });

  const backspace = () =>
    handlePress(() => {
      if (currentInput === DIV_ZERO_MSG) {
        setCurrentInput("0");
        return;
      }
      if (currentInput.length > 1) {
        setCurrentInput(currentInput.slice(0, -1));
      } else {
        setCurrentInput("0");
      }
    });

  const handleToggleTheme = () => {
    vibrate();
    setDarkMode(!darkMode);
  };

  const containerStyle = {
    backgroundColor: darkMode ? "#000" : "#fff",
  };

  const displayStyle = {
    color: darkMode ? "#fff" : "#000",
  };

  const buttonStyle = {
    backgroundColor: darkMode ? "#333" : "#eee",
  };

  const buttonTextStyle = {
    color: darkMode ? "#fff" : "#000",
  };

  const Button = ({ title, onPress, style, isOperation = false }) => (
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
        <Text style={[styles.buttonText, buttonTextStyle]}>{title}</Text>
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

      {/* Buttons Grid */}
      <View style={styles.buttonsGrid}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  displayContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  displayText: {
    fontSize: 60,
    fontWeight: "300",
  },
  buttonsGrid: {
    flex: 2,
    justifyContent: "space-evenly",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  operationButton: {
    backgroundColor: "#ff9500",
  },
  zeroButton: {
    flex: 2,
    aspectRatio: 2.2,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  equalsButton: {
    backgroundColor: "#ff9500",
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "500",
  },
  historyContainer: {
    maxHeight: 150,
    padding: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});
