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
  
    <Authenticator
      hideSignUp={true}
      components={components}
      formFields={formFields}
    >
      {({ signOut, user }) => (
        <Routes>
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
        </Routes>
      )}
    </Authenticator>
  );
}

const components = {
  Header() {
    return (
      <View textAlign="center" style={{ marginBotton: 20 }}>
        <Image
          alt="Beckett media logo"
          src="https://uploads-ssl.webflow.com/5e3335504b445e809f69e502/624368f205c22422f5fd98e6_shubham-dhage-fQL1DKNUQZw-unsplash.jpeg"
        />
      </View>
    );
  },

  Footer() {
    return (
      <View textAlign="center" marginTop="20px">
        <Text>&copy; 2022 Beckett Media All Rights Reserved</Text>
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
      placeholder: "Email",
      isRequired: true,
      label: "Email:",
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
