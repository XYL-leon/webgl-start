import axios from "axios";

// "http://10.92.14.202:8790/V1/weather/liveBroadcast/stationLive/liveData?cntyCode=220000&siteTypeCode=1&elementsCode=vis&code=vis_real";
export const liveData = (params) => {
    return axios.get("/V1/weather/liveBroadcast/stationLive/liveData", { params });
};