import { useEffect} from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize("G-W2PGS8NT21");
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
        console.log(location.pathname)
    }, [location]);

};

export default usePageTracking;