import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import useSound from "use-sound";
import { finishCountDown, setCount } from "./countDownSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkerOutgoingMessage } from "./countDownTimerTypes";
import getWorker from "./workerInstance";
import { saveSessionMutationFn } from "../../api/sessions";

export const useCountDown = () => {
  const initialCount = useAppSelector((s) => s.countDown.initialCount);
  const taskId = useAppSelector((s) => s.taskPanel.selectedItem);
  const [audio] = useSound("./sounds/guitar.mp3", {
    volume: 1,
  });
  const queryClient = useQueryClient();
  const addSessionMutation = useMutation({
    mutationFn: saveSessionMutationFn,
    onSuccess: () => {
      queryClient.refetchQueries(["sessions"]);
    },
  });
  const webWorker = useMemo(() => getWorker(), []);
  const dispatch = useAppDispatch();

  const count = useAppSelector((s) => s.countDown.count);

  useEffect(() => {
    if (webWorker) {
      webWorker.onmessage = (e: any) => {
        const message = e.data as WorkerOutgoingMessage;
        const { action } = message;
        console.log("worker: message", message);
        if (action === "DECREASE_COUNT") {
          const { currentCount } = message;
          dispatch(setCount(currentCount));
        }
        if (action === "PLAY_NOTIFICATION") {
          audio();
        }
        if (action === "FINISH_TIMER") {
          dispatch(finishCountDown());
          if (taskId) {
            addSessionMutation.mutate({ initialCount: initialCount, taskId });
          }
        }
      };
    }
  }, [webWorker, audio, dispatch, initialCount, taskId, addSessionMutation]);

  return {
    count: count,
    startCountDown: () => {
      webWorker.postMessage({
        action: "START_TIMER",
        initialCount: count,
      });
    },
    stopCountDown: () => {
      webWorker.postMessage({
        action: "STOP_TIMER",
      });
    },
  };
};
