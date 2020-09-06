import * as moment from "moment";
import { fetchDetailedResults, fetchSimpleResults } from "./Gateway";
import { DetailedResult } from "./Contract";

async function main(argv: string[]): Promise<void> {
  const from = argv[2];
  const to = argv[3];
  const fromDate = moment(from);
  const toDate = moment(to);
  if (!fromDate.isValid() || !toDate.isValid()) {
    throw new Error(`date format is invalid. from = ${from} to = ${to}`);
  }
  const simpleResults = await fetchSimpleResults(fromDate, toDate);
  const results = await fetchDetailedResults(simpleResults);
  console.log(
    formatCSV(results.sort((x, y) => x.start.unix() - y.start.unix()))
  );
}

function formatCSV(results: DetailedResult[]): string {
  return results
    .map((r) => {
      const players = r.players.sort((x, y) => x.name.localeCompare(y.name));
      return [
        r.start.format("YYYY-MM-DD"),
        "",
        r.rule,
        r.stage,
        r.win ? "勝ち" : "負け",
      ]
        .concat(players.map((p) => p.weapon))
        .join(",");
    })
    .join("\n");
}

main(process.argv).catch((e) => console.error(e));
