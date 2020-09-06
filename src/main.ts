import * as moment from "moment";
import { fetchSimpleResults } from "./Gateway";

async function main(argv: string[]): Promise<void> {
  const from = argv[2];
  const to = argv[3];
  const fromDate = moment(from);
  const toDate = moment(to);
  if (!fromDate.isValid() || !toDate.isValid()) {
    throw new Error(`date format is invalid. from = ${from} to = ${to}`);
  }
  const simpleResults = await fetchSimpleResults(fromDate, toDate);
  console.log(simpleResults);
}

main(process.argv).catch((e) => console.error(e));
