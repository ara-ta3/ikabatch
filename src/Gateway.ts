import * as moment from "moment";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { DetailedResult, Player, SimpleResult } from "./Contract";

const statInk = "https://stat.ink";

export async function fetchSimpleResults(
  from: moment.Moment,
  to: moment.Moment
): Promise<SimpleResult[]> {
  const url = `${statInk}/@ara_ta3/spl2?filter%5Brule%5D=private-private-any&filter%5Bmap%5D=&filter%5Bweapon%5D=&filter%5Brank%5D=&filter%5Bresult%5D=&filter%5Bhas_disconnect%5D=&filter%5Bterm%5D=term&filter%5Bterm_from%5D=${from.format(
    "YYYY-MM-DD"
  )}+18%3A00%3A00&filter%5Bterm_to%5D=${to.format(
    "YYYY-MM-DD"
  )}+18%3A00%3A00&filter%5Btimezone%5D=Asia%2FTokyo`;

  const response = await fetch(url);
  const body = await response.text();
  const page = await new JSDOM(body);
  const rows = page.window.document.getElementsByClassName("battle-row");
  return Array.from(rows).map((r: HTMLTableRowElement) => {
    const cells = Array.from(r.cells);
    const detailButton: HTMLTableCellElement = cells[0];
    const detailAnchor = detailButton.childNodes[0] as HTMLAnchorElement;
    const result: HTMLTableCellElement = cells.find(
      (c) => c.className === "cell-result"
    );
    return {
      win: result.childNodes[0].textContent === "Won",
      detailUrl: detailAnchor.href,
    };
  });
}

export async function fetchDetailedResults(
  simpleResults: SimpleResult[]
): Promise<DetailedResult[]> {
  let results: DetailedResult[] = [];
  for (const r of simpleResults) {
    const detail = await fetchDetailedResult(r);
    results.push(detail);
  }
  return results;
}

async function fetchDetailedResult(
  simpleResult: SimpleResult
): Promise<DetailedResult> {
  const url = `${statInk}${simpleResult.detailUrl}`;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    },
    body: null,
    method: "GET",
  });
  const body = await response.text();
  const page = await new JSDOM(body);
  const table = page.window.document.getElementById(
    "battle"
  ) as HTMLTableElement;
  const tbody = table.childNodes[0] as HTMLTableSectionElement;
  const rule = tbody.rows[1].cells[1].textContent
    .replace("プライベートマッチ", "")
    .replace("-", "")
    .trim();
  const stage = tbody.rows[2].cells[1].textContent;
  const format = "YYYY/MM/DD HH:mm:ss";
  const start = moment(
    tbody.rows[14].cells[1].childNodes[0].textContent,
    format
  );
  const end = moment(tbody.rows[15].cells[1].childNodes[0].textContent, format);

  const playerTable = page.window.document.getElementById(
    "players"
  ) as HTMLTableElement;
  const playerTbody = table.childNodes[0] as HTMLTableSectionElement;
  const players: Player[] = Array.from(playerTbody.rows)
    .filter((r) => {
      return r.cells.item(0).className === "bg-his";
    })
    .map((r) => {
      return {
        name: r.cells.item(1).textContent,
        weapon: r.cells.item(2).textContent,
      } as Player;
    });

  return {
    players: players,
    rule: rule,
    stage: stage,
    win: simpleResult.win,
    start: start,
    end: end,
  };
}
