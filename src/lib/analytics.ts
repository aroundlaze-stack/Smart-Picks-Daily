import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-QR3PXF2F2F";

export const initializeAnalytics = () => {
  ReactGA.initialize(MEASUREMENT_ID);

  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });
};