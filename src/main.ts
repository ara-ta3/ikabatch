import * as moment from "moment";
import { fetchDetailedResults, fetchSimpleResults } from "./Gateway";
import { DetailedResult, Player } from "./Contract";

async function main(argv: string[]): Promise<void> {
  const from = argv[2];
  const to = argv[3];
  const fromDate = moment(from);
  let toDate = fromDate.clone().add(moment.duration().add(1, "d"));
  if (to !== undefined) {
    toDate = moment(to);
  }
  if (!fromDate.isValid() || !toDate.isValid()) {
    throw new Error(`date format is invalid. from = ${from} to = ${to}`);
  }
  const simpleResults = await fetchSimpleResults(fromDate, toDate);
  const results = await fetchDetailedResults(simpleResults);
  const [head, body] = formatCSV(
    results.sort((x, y) => x.start.unix() - y.start.unix())
  );
  console.log(head);
  console.log("\n");
  console.log("----------------------");
  console.log("\n");
  console.log(body);
}

function formatCSV(results: DetailedResult[]): [string, string] {
  let headerPlayers: Player[] = [];

  const body = results
    .map((r) => {
      const players = r.players.sort((x, y) => x.name.localeCompare(y.name));
      if (headerPlayers.length === 0) {
        headerPlayers = players;
      }
      return [
        r.start.format("YYYY/MM/DD"),
        "練習",
        r.rule,
        r.stage,
        r.win ? "勝ち" : "負け",
      ]
        .concat(players.map((p) => p.weapon))
        .join(",");
    })
    .join("\n");
  const header = ["日付", "本番 or 練習", "ルール", "ステージ", "勝敗"]
    .concat(headerPlayers.map((p) => p.name))
    .join(",");
  return [header, body];
}

main(process.argv).catch((e) => console.error(e));
