import { useEffect, useRef, useState } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import useSound from "use-sound";
import { finishCountDown } from "./countDownSlice";
import { decreaseCount } from "./countDownSlice";

export const useCountDown = () => {
  const [audioCounter, setAudioCounter] = useState(0);
  const maxAudioCounter = 3;
  const [audio] = useSound("./sounds/guitar.mp3", {
    volume: 1,
  });
  const dispatch = useAppDispatch();

  const onPause = useAppSelector(
    (s) => s.countDown.isOnPause
  );
  const count = useAppSelector((s) => s.countDown.count);

  const ref = useRef<any>(null);
  const audioRef = useRef<any>(null);

  useEffect(() => {
    console.log("set interval");
    const intervalId = setInterval(() => {
      console.log("interval iteration");
      if (!onPause) {
        dispatch(decreaseCount());
      }
    }, 1000);

    ref.current = intervalId;
    return () => clearInterval(intervalId);
  }, [onPause, dispatch]);

  // handling pause
  useEffect(() => {
    if (onPause) {
      console.log("clear interval");
      clearInterval(ref.current);
    }
  }, [onPause]);

  // handling finish
  useEffect(() => {
    if (count === 0) {
      dispatch(finishCountDown());

      // handling audio effect
      // if maxAudioCounter is 0, it means audio is disabled
      if (maxAudioCounter > 0) {
        // play the first time
        audio();
        setAudioCounter((prev) => prev + 1);
        if (maxAudioCounter > 1) {
          // set recurring playback
          audioRef.current = setInterval(() => {
            audio();
            setAudioCounter((prev) => prev + 1);
          }, 1900);
        }
      }
    }
  }, [count, audio, maxAudioCounter, audioRef, dispatch]);

  // stopping audio effect after it reaches maxAudioCounter
  useEffect(() => {
    console.log("audioCounter", audioCounter);
    if (
      audioCounter >= maxAudioCounter &&
      audioRef.current
    ) {
      clearInterval(audioRef.current);
      setAudioCounter(0);
    }
  }, [audioCounter, maxAudioCounter, audioRef]);

  return count;
};
