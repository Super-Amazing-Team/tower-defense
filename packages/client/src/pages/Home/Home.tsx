import {
  Typography,
  Link,
  Box,
  ThemeProvider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import cursorPointer from "@/../public/UI/cursorPointer.png";
import cursorHand from "@/../public/UI/cursorHand.png";
import { TRoutes as R } from "@/types";
import { useUserStore } from "@/store";
import {
  ColorDict,
  TDEngine,
  TEnemyType,
  TTowerTypes,
} from "@/pages/Game/engine/TDEngine";
import { gameTheme } from "@/pages/Game/Game";
import grassBg from "@/../public/sprites/map/grassBg.png";
import { TowerImage } from "@/pages/Game/components/TowerImage/TowerImage";
import { EnemyImage } from "@/pages/Game/components/EnemyImage/EnemyImage";

export interface IHome {
  engine: TDEngine;
}

export function Home({ engine }: IHome) {
  const gameWindow = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuth = useUserStore((store) => store.user.isAuth);

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (engine.towers?.length) {
      engine.towers.forEach((tower) => {
        tower.drawBase();
      });
    }
  });

  useEffect(() => {
    // engine init
    if (!engine.isInitialized) {
      // set engine params
      engine.isDemo = true;
      // init teh engine
      engine
        .init(gameWindow.current!)
        .then(() => {
          engine.map?.drawMap();
          engine.map?.drawMapDecorations();

          // set engine init flag to true
          engine.isInitialized = true;
          setIsLoading(false);

          // start demo stage
          engine.startDemo();
          // debug
          console.log(`engine`);
          console.log(engine);
          //
        })
        .catch((error) => {
          throw new Error(
            `Can't initialize teh engine, reason: ${error.reason ?? error}`,
          );
        });
    }
    // componentWillUnmount
    return () => {
      // reload teh engine
      engine.gameStop();
      cancelAnimationFrame(engine.animationFrameId);
      engine.reload();
    };
  }, []);

  return (
    <ThemeProvider theme={gameTheme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          cursor: `url("${cursorPointer}"), auto`,
          position: "relative",
          background: `url("${!isLoading ? grassBg : ""}") 0 0 repeat`,
          "& .b-game-window": {
            position: "absolute",
            top: 0,
            left: 0,
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 1,
            display: !isLoading ? "flex" : "none",
          },
          "& .b-home-page-wrapper": {
            position: "relative",
            zIndex: 10,
          },
          "& .b-loader-wrapper": {
            position: "fixed",
            display: "flex",
            width: "100%",
            height: "100%",
            zIndex: 100,
            left: 0,
            top: 0,
            background: "#444444",
            opacity: 0.2,
          },
          "& .b-text-background": {
            border: `4px solid ${ColorDict.borderColor}`,
            borderRadius: "8px",
            background: ColorDict.sandColor,
            padding: "32px",
          },
          "& .b-tower-image-wrapper": {
            position: "relative",
            top: "32px",
          },
          "& h2, & h3, & h4, & a": {
            textShadow: `4px 4px ${ColorDict.fontColor}`,
          },
          "& h4": {
            color: ColorDict.sandColor,
          },
        }}
      >
        <>
          <Box className="b-game-window" id="gameWindow" ref={gameWindow} />
          {isLoading && (
            <Grid
              className="b-loader-wrapper"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Grid>
          )}
          <Box
            className="b-home-page-wrapper"
            sx={{
              "& a:hover": {
                cursor: `url("${cursorHand}"), auto`,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "relative",
                minHeight: "1152px",
                maxWidth: "1920px",
                margin: "0 auto",

                "& > a": {
                  color: ColorDict.sandColor,
                  textAlign: "center",
                  marginBottom: "60px",
                },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  textAlign: "center",
                  fontSize: "5rem",
                  margin: "160px 0 180px",
                  color: "#DFE0E7",
                }}
              >
                Tower Defense
              </Typography>
              <Link
                variant="h4"
                color={ColorDict.sandColor}
                component={RouterLink}
                to={isAuth ? R.game : R.login}
              >
                {isAuth ? "Играть" : "Войти"}
              </Link>
              <Link
                variant="h4"
                href="#about"
                color={ColorDict.sandColor}
                onClick={() => scrollToElement("about")}
              >
                Об игре
              </Link>
              <Link
                variant="h4"
                color={ColorDict.sandColor}
                component={RouterLink}
                to={R.leaderboard}
              >
                Лидерборд
              </Link>
            </Box>
            <Box
              sx={{
                padding: "152px 300px 100px",
                maxWidth: "1920px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              id="about"
            >
              <>
                <Typography
                  variant="h3"
                  sx={{
                    padding: "0 0 100px",
                    color: "#FFC08B",
                    textAlign: "center",
                  }}
                >
                  Об игре
                </Typography>
                <Box className="b-text-background">
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    Классический тавер дефенс. Цель игры - остановить монстров
                    от прохода через карту, путем постройки башен. Башни
                    строятся за деньги, которые игрок зарабатывает убийством
                    монстров.
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    padding: "60px 0 60px 128px",
                    textAlign: "left",
                  }}
                >
                  Есть несколько типов башен:
                </Typography>
                <Box className="b-text-background">
                  {Object.entries(engine.predefinedTowerParams).map((tower) => {
                    const towerType = tower[0] as TTowerTypes;
                    return (
                      <Box
                        key={`b-tower-${towerType}-image-wrapper`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          margin: "0 0 60px",
                        }}
                      >
                        <TowerImage
                          key={`b-enemy-${towerType}-image`}
                          engine={engine}
                          towerType={towerType}
                        />
                        <Typography
                          key={`b-tower-${towerType}-description`}
                          variant="h5"
                          sx={{
                            margin: "26px 0 0 60px",
                            textAlign: "left",
                          }}
                        >
                          {`${tower[1].towerParams?.description}`}
                        </Typography>
                      </Box>
                    );
                  })}
                  <Typography
                    variant="h5"
                    sx={{
                      padding: "0 0 60px",
                      textAlign: "left",
                    }}
                  >
                    У каждой башни есть три уровня улучшения. Время улучшения
                    башни зависит от текущего уровня башни. Более продвинутые
                    башни улучшаются дольше. Во время улучшения башня не может
                    атаковать.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TowerImage
                      engine={engine}
                      towerType="three"
                      upgradeLevel={0}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        margin: "0 80px",
                      }}
                    >
                      -&gt;
                    </Typography>
                    <TowerImage
                      engine={engine}
                      towerType="three"
                      upgradeLevel={1}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        margin: "0 80px",
                      }}
                    >
                      -&gt;
                    </Typography>
                    <TowerImage
                      engine={engine}
                      towerType="three"
                      upgradeLevel={2}
                    />
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    padding: "60px 0 60px 128px",
                    textAlign: "left",
                  }}
                >
                  Несколько типов врагов:
                </Typography>
                <Box className="b-text-background">
                  {Object.entries(engine.enemySprites).map((enemy) => {
                    const enemyType = enemy[0] as TEnemyType;
                    return (
                      <Box
                        sx={{ display: "flex" }}
                        key={`b-enemy-${enemyType}-image-wrapper`}
                      >
                        <EnemyImage
                          key={`b-enemy-${enemyType}-image`}
                          engine={engine}
                          enemyType={enemyType}
                        />
                        <Typography
                          key={`b-enemy-${enemyType}-description`}
                          variant="h5"
                          sx={{
                            margin: "26px 0 0 60px",
                            textAlign: "left",
                            fontFamily: "'Press Start 2P', cursive",
                          }}
                        >
                          {`${engine.enemySprites[enemyType]?.description}`}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    margin: "60px 0 60px 128px",
                  }}
                >
                  Как играть:
                </Typography>
                <Box className="b-text-background">
                  <Typography
                    variant="h5"
                    sx={{
                      padding: "0 0 40px",
                      textAlign: "left",
                    }}
                  >
                    После старта игры через некоторое время по карте начнут идти
                    враги. Нужно строить башни, которые будут атаковать врагов и
                    мешать им дойти до конца карты.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      padding: "0 0 40px",
                      textAlign: "left",
                    }}
                  >
                    Игра состоит из нескольких волн или раундов. После убийства
                    всех врагов в текущей волне, после небольшой паузы,
                    начинается следующий раунд, в котором больше врагов, у них
                    больше здоровья и они быстрее перемещаются по карте.
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      pb: 10,
                      textAlign: "left",
                    }}
                  >
                    С каждым новым раундом игрок так же получает больше золота
                    за убийство врагов. Когда враг доходит до конца дороги, у
                    игрока отнимается одна жизнь. Как только все жизни
                    заканчиваются - игрок проиграл.
                  </Typography>
                </Box>
                <Link
                  variant="h4"
                  component={RouterLink}
                  to={isAuth ? R.game : R.login}
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    color: ColorDict.sandColor,
                    textDecorationColor: "rgba(255, 192, 139, 0.4)",
                  }}
                >
                  {isAuth ? "Играть" : "Войти"}
                </Link>
              </>
            </Box>
          </Box>
        </>
      </Grid>
    </ThemeProvider>
  );
}
