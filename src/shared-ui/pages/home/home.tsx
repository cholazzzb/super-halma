import { Show } from "@chakra-ui/react";
import { useState } from "react";

import { useMusicPlayer } from "@/shared-logic/hook/use-music-player";
import { Game } from "./section/game";
import { HomeSection } from "./section/home";
import { Setup } from "./section/setup";

type Section = "home" | "setup" | "game";

const Home = () => {
  const [section, setSection] = useState<Section>("home");

  const musicPlayer = useMusicPlayer();

  const toSetupSection = () => {
    setSection("setup");
    musicPlayer.play();
  };

  const toPlaySection = () => {
    setSection("game");
  };

  return (
    <>
      <Show when={section === "home"}>
        <HomeSection toSetupSection={toSetupSection} />
      </Show>
      <Show when={section === "setup"}>
        <Setup toPlaySection={toPlaySection} />
      </Show>
      <Show when={section === "game"}>
        <Game />
      </Show>
    </>
  );
};

export default Home;
