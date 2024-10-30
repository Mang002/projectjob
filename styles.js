import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  // background หน้าล็อคอิน
  container: {
    flex: 1,
    backgroundColor: "#0000",
    justifyContent: "center",
    alignItems: "center",

  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "black",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "#000",
  },
  forgot: {
    color: "black",
    fontSize: 11,
  },
  loginText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },
  registerText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
    textDecorationLine: "underline",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    shadowColor: "black", // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset for X and Y axis
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 4.65, // Blur radius
    elevation: 8, // Elevation for Android
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 10,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  tinyLogo: {
    borderRadius: 50,
    width: 90,
    height: 90,
  },
  forgotText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
export default styles;
