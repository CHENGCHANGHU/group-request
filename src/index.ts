export async function request<R extends any[] = any[]>({
  group,
  maxRetry,
  retryDelay,
}: IGroupRequestOptions): Promise<R> {
  const results: R = Array(group.length).fill(null) as R;
  const indexMap = new Map(group.map((item, index) => [item, index]));

  const a: Array<IWrapped> = group.map(item => wrap(item));
  const b: Array<IWrapped> = [];
  let current: Array<IWrapped> = a;

  function wrap(item: IItem): IWrapped {
    return async () => {
      try {
        results[indexMap.get(item)] = await item();
      } catch (e) {
        if (e.retry) {
          if (current === a) {
            b.push(wrap(item));
          } else {
            a.push(wrap(item));
          }
        }
      }
    };
  };

  while (current.length !== 0 && typeof maxRetry === 'number' && maxRetry > 0) {
    console.log('request start', current.length, maxRetry);
    await Promise.all(current.map(async fn => await fn()));
    current.length = 0;
    if (current === a) {
      current = b;
    } else {
      current = a;
    }
    if (typeof maxRetry === 'number') {
      maxRetry--;
    }
    if (typeof retryDelay === 'number') {
      await sleep(retryDelay);
    }
    console.log('request end', current.length, maxRetry);
  }

  return results;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface IItem {
  (...args: any[]): Promise<any>;
}

export interface IWrapped {
  (): Promise<void>;
}
 
export interface IGroupRequestOptions {
  group: Array<IItem>;
  maxRetry?: number;
  retryDelay?: number;
}
