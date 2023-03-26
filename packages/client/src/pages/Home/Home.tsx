import {
  Container,
  Typography,
  Link,
  Box,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PressStart2P from "../../../public/fonts/PressStart2P-Regular.ttf";
import backgroundImg from "../../../public/images/background.png";
import mainPic from "../../../public/images/main-pic.png";
import waterTiles from "../../../public/images/water-tiles.gif";
import towerBase1 from "../../../public/images/towerTwoBase-1.png";
import towerBase2 from "../../../public/images/towerTwoBase-2.png";
import towerBase3 from "../../../public/images/towerTwoBase-3.png";
import { ItemComponent } from "./ItemComponent";
import { TRoutes as R } from "@/types";
import { useUserStore } from "@/store";
import { gameDetails } from "@/utils/gameDetails";

export function Home() {
  const isAuth = useUserStore((store) => store.user.isAuth);
  const isMatches = useMediaQuery("(max-width: 1440px)");

  const theme = createTheme({
    typography: {
      fontFamily: "'Press Start 2P', cursive",
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#262626",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: "Press Start 2P";
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local("Press Start 2P"), url(${PressStart2P}) format("ttf");
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters={true}>
        <Box
          sx={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "320px 320px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
              backgroundImage: `url(${mainPic})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "1152px",
              maxWidth: "1920px",
              margin: "0 auto",
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
              component={RouterLink}
              to={isAuth ? R.game : R.login}
              sx={{
                textAlign: "center",
                marginBottom: "60px",
                cursor: "pointer",
                color: "#FFC08B",
                textDecorationColor: "rgba(255, 192, 139, 0.4)",
              }}
            >
              {isAuth ? "Играть" : "Войти"}
            </Link>
            <Link
              variant="h4"
              href="#about"
              color="#FFC08B"
              sx={{
                textAlign: "center",
                marginBottom: "60px",
                cursor: "pointer",
                color: "#FFC08B",
              }}
              onClick={() => scrollToElement("about")}
            >
              Об игре
            </Link>
            <Link
              variant="h4"
              component={RouterLink}
              to={R.leaderboard}
              color="#FFC08B"
              sx={{
                textAlign: "center",
                marginBottom: "60px",
                cursor: "pointer",
                color: "#FFC08B",
              }}
            >
              Лидерборд
            </Link>
            <Box
              mt={5}
              sx={{
                backgroundImage: `url(${waterTiles})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                width: "256px",
                height: "256px",
                position: "absolute",
                top: "220px",
                right: isMatches ? "300px" : "460px",
              }}
            />
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
            <Typography
              variant="h5"
              sx={{
                padding: "0 0 60px",
                textAlign: "left",
              }}
            >
              Классический тавер дефенс. Цель игры - остановить монстров от
              прохода через карту, путем постройки башен. Башни строятся за
              деньги, которые игрок зарабатывает убийством монстров.
            </Typography>
            <Typography
              variant="h4"
              sx={{
                padding: "0 0 60px 128px",
                textAlign: "left",
              }}
            >
              Есть несколько типов башен:
            </Typography>
            {gameDetails.towers.map((tower) => (
              <ItemComponent
                key={tower.image}
                image={tower.image}
                text={tower.text}
                smallImage={false}
              />
            ))}
            <Typography
              variant="h5"
              sx={{
                padding: "0 0 60px",
                textAlign: "left",
              }}
            >
              У каждой башни есть три уровня улучшения. Время улучшения башни
              зависит от текущего уровня башни. Более продвинутые башни
              улучшаются дольше. Во время улучшения башня не может атаковать.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "100px",
              }}
            >
              <img src={towerBase1} alt="Tower" />
              <Typography
                variant="h5"
                sx={{
                  margin: "0 80px",
                }}
              >
                -&gt;
              </Typography>
              <img src={towerBase2} alt="Tower" />
              <Typography
                variant="h5"
                sx={{
                  margin: "0 80px",
                }}
              >
                -&gt;
              </Typography>
              <img src={towerBase3} alt="Tower" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                padding: "0 0 60px 128px",
                textAlign: "left",
              }}
            >
              Несколько типов врагов:
            </Typography>
            {gameDetails.enemies.map((enemy) => (
              <ItemComponent
                key={enemy.image}
                image={enemy.image}
                text={enemy.text}
                smallImage={true}
              />
            ))}
            <Typography
              variant="h4"
              sx={{
                textAlign: "left",
                margin: "40px 0 60px 128px",
              }}
            >
              Как играть:
            </Typography>
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
              Игра состоит из нескольких волн или раундов. После убийства всех
              врагов в текущей волне, после небольшой паузы, начинается
              следующий раунд, в котором больше врагов, у них больше здоровья и
              они быстрее перемещаются по карте.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                pb: 10,
                textAlign: "left",
              }}
            >
              С каждым новым раундом игрок так же получает больше золота за
              убийство врагов. Когда враг доходит до конца дороги, у игрока
              отнимается одна жизнь. Как только все жизни заканчиваются - игрок
              проиграл.
            </Typography>
            <Link
              variant="h4"
              component={RouterLink}
              to={isAuth ? R.game : R.login}
              sx={{
                textAlign: "center",
                mt: 3,
                cursor: "pointer",
                color: "#FFC08B",
                textDecorationColor: "rgba(255, 192, 139, 0.4)",
              }}
            >
              {isAuth ? "Играть" : "Войти"}
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
