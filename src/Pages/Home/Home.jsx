import React from "react";
import "./Home.css";
import Header from "../../Components/Header/Header";
import ExploreMenu from "../../Components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../Components/FoodDisplay/FoodDisplay";
import AppDownload from "../../Components/AppDownload/AppDownload";
import { Container } from "@mui/material";
import Chat from "../../Components/Chat/Chat";

const Home = () => {
  return (
    <div>
      <Container maxWidth="lg">
        <Header />
        <ExploreMenu />
        <FoodDisplay />
        <Chat />
        <AppDownload />
      </Container>
    </div>
  );
};

export default Home;
