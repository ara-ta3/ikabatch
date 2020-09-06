import * as moment from "moment";
import { fetchSimpleResults } from "./Gateway";

async function main(): Promise<void> {
  const from = "2020-08-31";
  const to = "2020-09-01";
  const fromDate = moment(from);
  const toDate = moment(to);
  const simpleResults = await fetchSimpleResults(fromDate, toDate);
  console.log(simpleResults);
}

main().catch((e) => console.error(e));
