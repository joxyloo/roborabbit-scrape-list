const API_KEY = 'your_api_key';
const TASK_ID = 'your_task_id';

(async () => {

  const runRes = await runTask();
  const { uid: runId } = runRes;
  const saveAttributeId = `${runRes.steps[1].uid}_${runRes.steps[1].action}`;
  const goId = `${runRes.steps[0].uid}_${runRes.steps[0].action}`;

  let urlRes = await getResult(TASK_ID, runId);
  const urls = urlRes.outputs[saveAttributeId];
  const domain = urlRes.outputs[goId].location;

  const fullUrl = urls.map((url) => (url.charAt(0) === '/' ? domain + url.substring(1) : url));
  console.log(fullUrl);
//   [
//     'https://www.roborabbit.com/',
//     'https://www.roborabbit.com/',
//     'https://app.bannerbear.com/',
//     'https://www.roborabbit.com/ai-quick-start/',
//     'https://www.roborabbit.com/product/task-builder/',
//     'https://www.roborabbit.com/product/web-scraping/',
//     ...
//   ]
})();

async function runTask() {
  const res = await fetch(`https://api.roborabbit.com/v1/tasks/${TASK_ID}/runs`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return res.json();
}

async function getRun(taskId, runId) {
  const res = await fetch(`https://api.roborabbit.com/v1/tasks/${taskId}/runs/${runId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return res.json();
}

async function getResult(taskId, runId) {
  return new Promise((resolve) => {
    const polling = setInterval(async () => {
      const runResult = await getRun(taskId, runId);

      if (runResult.status === 'running') {
        console.log('Still running.....');
      } else if (runResult.status === 'finished') {
        console.log('Finished');
        resolve(runResult);
        clearInterval(polling);
      }
    }, 2000);
  });
}
