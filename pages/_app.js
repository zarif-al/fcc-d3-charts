import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { AnimatePresence, motion } from "framer-motion";
function MyApp({ Component, pageProps, router }) {
  let backGroundColor;
  if (router.route === "/") {
    backGroundColor = "#0080a3";
  }
  if (router.route === "/scatterPlot") {
    backGroundColor = "#5300fa";
  }
  if (router.route === "/heatMap") {
    backGroundColor = "#800175";
  }
  if (router.route === "/choroplethMap") {
    backGroundColor = "#009B77";
  }
  if (router.route === "/treeMap") {
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } },
        }}
      >
        <Navbar
          expand="lg"
          style={{
            marginBottom: "2rem",
            backgroundColor: "white",
          }}
        >
          <Nav className="mr-auto" defaultActiveKey={router.route}>
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
      </motion.div>
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </div>
  );
}

export default MyApp;
