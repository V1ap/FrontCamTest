import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.scss";
import { MicroIcon } from "./icons/MicroIcon";
import { SwitchCam } from "./icons/SwitchCamIcon";
import { CloseIcon } from "./icons/closeIcon";

const mimeType = 'video/webm; codecs="opus,vp8"';

const VideoRecorder = () => {
  const [permission, setPermission] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const liveVideoFeed = useRef<HTMLVideoElement>(null);

  const [recordingStatus, setRecordingStatus] = useState("inactive");

  const [stream, setStream] = useState<MediaStream>();

  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  const [facingMode, setFacingMode] = useState("user");

  const [isMicroMuted, setIsMicroMuted] = useState(false);

  const [timerStart, setTimerStart] = useState(5);

  const [isBlackSCreenOpen, setIsBlackScreenOpen] = useState(false);

  const [timerEnd, setTimerEnd] = useState(2);

  const videoSettingRequest = () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return {
        audio: false,
        video: {
          facingMode: {
            exact: facingMode,
          },
        },
      };
    } else {
      return {
        audio: false,
        video: true,
      };
    }
  };

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = videoSettingRequest();
        const audioConstraints = { audio: true };

        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setPermission(true);

        const combinedStream = new MediaStream(
          isMicroMuted
            ? [...videoStream.getVideoTracks()]
            : [...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()]
        );

        setStream(combinedStream);

        if (liveVideoFeed.current) {
          liveVideoFeed.current.srcObject = videoStream;
        }
      } catch {
        setPermission(false);
      }
    } else {
      alert("Видеоответ не возможен в вашем браузере");
    }
  };

  const startTimerOfStartRecording = () => {
    setIsBlackScreenOpen(true);
    setTimerStart(5);
  };

  const startRecording = async () => {
    if (!permission) {
      getCameraPermission();
      return;
    }

    if (!stream) {
      return;
    }

    const media = new MediaRecorder(stream, { mimeType });

    mediaRecorder.current = media;

    try {
      mediaRecorder.current.start();
    } catch {
      setPermission(false);
      return;
    }
    setVideoChunks([]);
    setRecordingStatus("recording");

    const localVideoChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") {
        return;
      }
      if (event.data.size === 0) {
        return;
      }
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setTimerEnd(2);
    setRecordingStatus("inactive");
    if (!mediaRecorder.current) {
      return;
    }

    try {
      mediaRecorder.current.stop();
    } catch (err: any) {
      console.log(err);
    }

    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      setRecordedVideo(videoUrl);
    };
  };

  const handleSwitchCam = () => {
    facingMode === "user"
      ? setFacingMode("environment")
      : setFacingMode("user");
  };

  const handleMuteMicro = () => {
    setIsMicroMuted((prev) => !prev);
  };

  const muteMicro = async () => {
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = videoSettingRequest();
        const audioConstraints = { audio: true };

        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setPermission(true);

        const combinedStream = new MediaStream(
          isMicroMuted
            ? [...videoStream.getVideoTracks()]
            : [...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()]
        );

        setStream(combinedStream);
      } catch {
        setPermission(false);
      }
    } else {
      alert("Видеоответ не возможен в вашем браузере");
    }
  };

  const getMinutesAndSeconds = (time: number) =>
    `${Math.floor(time / 60)} : ${
      time % 60 > 9 ? time % 60 : "0" + (time % 60)
    }`;

  const handleAcceptVideo = () => {
    const videoBlob = new Blob(videoChunks, { type: mimeType });
    console.log(videoBlob);
    console.log(URL.createObjectURL(videoBlob));
  };

  useEffect(() => {
    getCameraPermission();
  }, [permission, facingMode]);

  useEffect(() => {
    muteMicro();
  }, [isMicroMuted]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isBlackSCreenOpen) {
        setTimerStart((prev) => (prev >= 0 ? prev - 1 : -1));
      }
    }, 1000);
    if (timerStart === -1) {
      setIsBlackScreenOpen(false);
      startRecording();
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isBlackSCreenOpen, timerStart]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (recordingStatus === "recording") {
        setTimerEnd((prev) => (prev >= 0 ? prev - 1 : -1));
      }
    }, 1000);
    if (timerEnd === -1) {
      stopRecording();
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [recordingStatus, timerEnd]);

  return (
    <>
      {isBlackSCreenOpen && (
        <div className={styles.blackScreen}>
          <div className={styles.timerOfStart}>
            <h2 className={styles.getReady}>Приготовтесь</h2>
            <p className={styles.timerStart}>{timerStart}</p>
          </div>
        </div>
      )}
      {!recordedVideo ? (
        <div className={styles.videoControls}>
          {recordingStatus === "inactive" && (
            <div className={styles.topControls}>
              <div className={styles.muteMicro}>
                <button
                  className={styles.muteMicroBtn}
                  onClick={handleMuteMicro}
                >
                  <MicroIcon />
                </button>
                <p className={styles.muteMicroText}>Микрофон</p>
              </div>
              {/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
                navigator.userAgent
              ) && (
                <div className={styles.switchCam}>
                  <button
                    className={styles.switchCamBtn}
                    onClick={handleSwitchCam}
                  >
                    <SwitchCam />
                  </button>
                  <p className={styles.switchCamText}>Повернуть</p>
                </div>
              )}
            </div>
          )}
          <div
            className={`${styles.bottomControls} ${
              recordingStatus === "recording" ? styles.recording : ""
            }`}
          >
            <button
              onClick={
                recordingStatus === "inactive"
                  ? startTimerOfStartRecording
                  : stopRecording
              }
              type="button"
              className={
                recordingStatus === "inactive"
                  ? styles.startVideo
                  : styles.stopVideo
              }
            >
              {" "}
            </button>
            {recordingStatus === "inactive" ? (
              <button className={styles.closeBtn}>
                <CloseIcon />
              </button>
            ) : (
              <div className={styles.timerOfEnd}>
                <span className={styles.redDot}>{}</span>
                <p className={styles.timerEnd}>
                  {getMinutesAndSeconds(timerEnd)}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
      {recordedVideo ? (
        <div className={styles.recordedControls}>
          <p className={styles.controlsQuestion}>Использовать это видео?</p>
          <div className={styles.recordedBtns}>
            <button className={styles.acceptlBtn} onClick={handleAcceptVideo}>
              Да
            </button>
            <button className={styles.cancelBtn} onClick={getCameraPermission}>
              Нет
            </button>
          </div>
        </div>
      ) : null}

      <div className={styles.videoPlayer}>
        {!recordedVideo ? (
          <video ref={liveVideoFeed} autoPlay className={styles.livePlayer}>
            {" "}
          </video>
        ) : null}
        {recordedVideo ? (
          <div className={styles.recordedPlayer}>
            <video
              className={styles.recorded}
              src={recordedVideo}
              autoPlay
              loop
            >
              {" "}
            </video>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoRecorder;
