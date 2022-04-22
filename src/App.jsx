import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import DepositPage from "./pages/DepositPage/DepositPage";
import WithdrawPage from "./pages/WithdrawPage/WithdrawPage";
import {
  Authenticator,
  Heading,
  View,
  Image,
  Text,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App() {
  return (
    <div>
      <Authenticator
        hideSignUp={true}
        components={components}
        formFields={formFields}
        className="u__flex flex__jcc flex__aic u__vw100 u__vh100"
      >
        {({ signOut, user }) => (
          <Routes>
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
          </Routes>
        )}
      </Authenticator>
    </div>
  );
}

const components = {
  Header() {
    return (
      <View textAlign="center" style={{ marginBotton: 20 }}>
        <Image
          alt="Beckett media logo"
          src={require("./static/Beckett-Logo-Full-Wordmark-0K.png")}
        />
      </View>
    );
  },

  Footer() {
    return (
      <View textAlign="center" marginTop="20px">
        <Text color="white" fontSize={"13px"}>
          &copy; 2022 Beckett Media All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      return (
        <Heading style={{ marginTop: 30 }} textAlign={"center"} level={4}>
          Sign in to your account
        </Heading>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      labelHidden: false,
      placeholder: "Username",
      isRequired: true,
      label: "Username:",
    },
    password: {
      labelHidden: false,
      placeholder: "Password",
      isRequired: true,
      label: "Password:",
    },
  },
};

export default App;
