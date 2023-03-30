import { useState } from "react";
import Webcam from "react-webcam";
import "./App.css";
import VideoRecorder from "./VideoRecorder";

const App = () => {
  let [recordOption, setRecordOption] = useState("video");

  const toggleRecordOption = (type: string) => {
    return () => {
      setRecordOption(type);
    };
  };

  return (
    <div>
      <h1>React Media Recorder</h1>
      {/* <div className="button-flex">
        <button onClick={toggleRecordOption("video")}>Record Video</button>
        <button onClick={toggleRecordOption("audio")}>Record Audio</button>
      </div> */}
      <div>{<VideoRecorder />}</div>
    </div>
  );
};

export default App;
