let worker: Worker;

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL("./worker.ts", import.meta.url));
  }

  return worker;
}

export default getWorker;
