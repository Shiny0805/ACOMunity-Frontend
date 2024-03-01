import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  update,
  get,
} from "firebase/database";
import { db } from "config/firebase";
import { sleep } from "./customHelpers";

function compareTimeStrings(timeString1, timeString2) {
  // Standardize the time strings
  const date1 = new Date(timeString1);
  const date2 = new Date(timeString2);

  // Compare the standardized time strings
  if (date1.getTime() === date2.getTime()) {
    return true;
  } else {
    return false;
  }
}

export async function limitedFunction(isSuccess, address) {
  const dbRef = ref(db, "/callCounts");
  const currentDate = new Date().toLocaleDateString();

  /////
  const callCountsLocalStorage =
    JSON.parse(localStorage.getItem("callCounts")) || {};

  if (callCountsLocalStorage[address]) {
    const newCallCounts = {
      address: address,
      callCount: callCountsLocalStorage[address].callCount,
      lastCalled: callCountsLocalStorage[address].lastCalled,
    };

    push(dbRef, newCallCounts);
    localStorage.setItem("callCounts", JSON.stringify({}));
    await sleep(1000);
  }
  /////

  const dbQuery = query(
    ref(db, "callCounts"),
    orderByChild("address"),
    equalTo(address)
  );

  const snapshot = await get(dbQuery);
  const exist = await snapshot.val();

  if (exist) {
    let callCounts = exist[Object.keys(exist)[0]];

    if (
      callCounts?.address &&
      callCounts?.callCount >= 3 &&
      !isSuccess &&
      compareTimeStrings(callCounts?.lastCalled, currentDate.toString())
    ) {
      return { success: false };
    }

    if (isSuccess) {
      if (
        callCounts?.address &&
        compareTimeStrings(callCounts?.lastCalled, currentDate.toString())
      ) {
        const dbRef = ref(db, `/callCounts/${Object.keys(exist)[0]}`);
        update(dbRef, { callCount: Number(callCounts?.callCount) + 1 });
      } else {
        const dbRef = ref(db, `/callCounts/${Object.keys(exist)[0]}`);
        update(dbRef, {
          callCount: 1,
          lastCalled: currentDate.toString(),
        });
      }
    } else {
      return { success: true };
    }
  } else {
    if (isSuccess) {
      const newCallCounts = {
        address: address,
        callCount: 1,
        lastCalled: currentDate.toString(),
      };
      push(dbRef, newCallCounts);
    } else {
      return { success: true };
    }
  }

  return { success: true };
}

export async function getCounts(address) {
  const currentDate = new Date().toLocaleDateString();
  const dbQuery = query(
    ref(db, "callCounts"),
    orderByChild("address"),
    equalTo(address)
  );

  const snapshot = await get(dbQuery);
  const exist = await snapshot.val();

  if (exist) {
    const callCount = exist[Object.keys(exist)[0]].callCount;
    const lastCalled = exist[Object.keys(exist)[0]].lastCalled;

    return {
      counts: callCount > 3 ? 3 : callCount,
      lastCalled: lastCalled,
    };
  }

  return { counts: 0, lastCalled: currentDate.toString() };
}

