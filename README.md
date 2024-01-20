# @golden-tiger/group-request

Initiate a group request and set the **retry logic and delay** when catching request errors. When a request goes wrong, you need to set the retry attribute of the rejection reason to true.

# Example

```js
import { request } from '@golden-tiger/group-request';
const testGroup = Array(10)
  .fill(0)
  .map((_, i) => ({ id: i, data: Math.random().toFixed(3) }))
  .map((data) => async () => await fakeRequest(data));

const results = await request({
  group: testGroup,
  maxRetry: 3,
  retryDelay: 1000,
});
console.log(results);
// [
//   null,
//   { retry: false, id: 1, time: 793, data: '0.706' },
//   { retry: false, id: 2, time: 525, data: '0.021' },
//   null,
//   { retry: false, id: 4, time: 383, data: '0.072' },
//   { retry: false, id: 5, time: 199, data: '0.434' },
//   { retry: false, id: 6, time: 450, data: '0.123' },
//   null,
//   null,
//   null
// ]
```

```js
// fakeRequest
async function fakeRequest({ id, data }) {
  const time = Math.floor(Math.random().toFixed(3) * 1000);
  await sleep(time);
  if (Math.random() < 0.8) {
    return Promise.reject({ retry: true, id, data, time });
  }
  return { retry: false, id, time, data };
}
```

```js
// sleep
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
```
