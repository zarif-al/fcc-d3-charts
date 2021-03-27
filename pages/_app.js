import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useRouter } from "next/router";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  let backGroundColor;
  if (router.pathname === "/") {
    backGroundColor = "steelblue";
  }
  if (router.pathname === "/scatterPlot") {
    backGroundColor = "#5300fa";
  }
  if (router.pathname === "/heatMap") {
    backGroundColor = "#ff0073";
  }
  if (router.pathname === "/choroplethMap") {
    backGroundColor = "#009B77";
  }
  if (router.pathname === "/treeMap") {
    backGroundColor = "#5B5EA6";
  }
  return (
    <div
      className={styles.container}
      style={{ backgroundColor: backGroundColor }}
    >
      <Head>
        <title>FCC Data Visualization Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        bg="light"
        expand="lg"
        style={{
          marginBottom: "2rem",
          backgroundColor: "white",
        }}
      >
        <Nav className="mr-auto" defaultActiveKey={router.pathname}>
          <Link href="/" passHref>
            <Nav.Link>Bar Chart</Nav.Link>
          </Link>
          <Link href="/scatterPlot" passHref>
            <Nav.Link>Scatter Plot</Nav.Link>
          </Link>
          <Link href="/heatMap" passHref>
            <Nav.Link>Heat Map</Nav.Link>
          </Link>
          <Link href="/choroplethMap" passHref>
            <Nav.Link>Choropleth Map</Nav.Link>
          </Link>
          <Link href="/treeMap" passHref>
            <Nav.Link>Tree Map</Nav.Link>
          </Link>
        </Nav>
      </Navbar>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
